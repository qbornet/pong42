import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';
import { UsersService } from 'src/database/service/users.service';
import { PongService } from './pong.service';

interface player {
  id: string;
  role: 1 | 2;
}

@WebSocketGateway(4000, { cors: true })
export class PongGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  } 
  
  isReady: boolean;
  constructor(private userService: UsersService, private pongService: PongService) {
    this.isReady = false;
  };
  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  afterInit(server: any) {
    this.logger.log('Initialize');
    // this.pongService.startBroadcastingBallState(this.io);
  }

  // stocker l'etat du joueur pour le matchmaking et stocker les rooms dans une map
  private waitingPlayer: player | null = null;
  private rooms: Map<string, player[]> = new Map();
  private roomCounter: number = 0;
  
  handleConnection(client: Socket, ...args: any[]): any {
    if (this.waitingPlayer) {
      const roomName = `room-${this.roomCounter++}`;
      this.pongService.initializeRoom(roomName);
      this.rooms.set(roomName, [this.waitingPlayer, {id: client.id, role: 2}]);
      
      client.join(roomName);
      client.emit('playerRole', 2);
      this.io.to(this.waitingPlayer.id).emit('startGame', roomName);
      this.io.to(client.id).emit('startGame', roomName);
      
      this.waitingPlayer = null;
    } else {
      this.waitingPlayer = {id: client.id, role: 1};
      client.emit('playerRole', 1);
    }
    this.logger.debug('New connection : '+ client.id);
  }

  handleDisconnect(client: any): any {
    this.logger.debug('Disconnected : ' + client.id + ' Reason: ' + client.reason);
    if (this.waitingPlayer && this.waitingPlayer.id === client.id) {
      this.waitingPlayer = null;
    }
  }

  private roomsReady: Map<string, number> = new Map();

  @SubscribeMessage('playerReady')
  handlePlayerReady(client: Socket) {
    const roomName = Object.keys(client.rooms)[1];
    
    this.roomsReady.set(roomName, (this.roomsReady.get(roomName) || 0) + 1);

    if (this.roomsReady.get(roomName) === 2) {
        const users = this.io.sockets.adapter.rooms.get(roomName);
        if (users) {
            const usersArray = Array.from(users);
            const leftPlayer = usersArray[0]; // Assuming the first player is always the left player.
            const rightPlayer = usersArray[1];
            this.pongService.startBroadcastingBallState(this.io, leftPlayer, rightPlayer, roomName);
        }
    }
};
  // @SubscribeMessage('playerReady')
  // handlePlayerReady(client: Socket) {
  //   this.isReady = true;
  //   const roomName = Object.keys(client.rooms)[0];
  //   const users = this.io.sockets.adapter.rooms.get(roomName);
  //   if (users && users.size === 2) {
  //     const usersArray = Array.from(users);
  //     const opponent = usersArray[0] === client.id ? usersArray[1] : usersArray[0];
  //     this.pongService.startBroadcastingBallState(this.io, leftPlayer, rightPlayer, roomName);
  //   }
  // };

  //ecoute les touche d'appuie sur les fleches
  @SubscribeMessage('paddleMovement1')
  handlePaddleMovement1(client: Socket, keycode: string): void {
    const roomName = Object.keys(client.rooms)[0];
    this.pongService.handleKeyCode1(keycode, roomName);
  }

  @SubscribeMessage('paddleMovement2')
  handlePaddleMovement2(client: Socket, keycode: string): void {
    const roomName = Object.keys(client.rooms)[0];
    this.pongService.handleKeyCode2(keycode, roomName);
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    this.logger.debug(await this.userService.getUser({username:"toto"}));
    this.logger.debug(payload);

  }
}
