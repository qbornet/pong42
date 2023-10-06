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

  private players: player[] = [];
  //tableau de joueurs 
  
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
  
  //checker pourquoi les socket des 2 clients sont mis a jour
  handleConnection(client: Socket, ...args: any[]): any {
    client.join('room-0');
    const users = this.io.sockets.adapter.rooms.get('room-0');
    this.logger.debug(client.id);
    if (users?.size === 1){
      this.players.push({id: client.id, role: 1});
      client.emit('playerRole', 1);
    }
    else if (users?.size === 2){
      this.players.push({id: client.id, role: 2});
      client.emit('playerRole', 2);
    }
    this.logger.debug('New connection : '+ client.id);
  }

  handleDisconnect(client: any): any {
    this.logger.debug('Disconnected : ' + client.id + ' Reason: ' + client.reason);
  }

  @SubscribeMessage('playerReady')
  handlePlayerReady(client: Socket) {
    this.isReady = true;
    const users = (this.io.sockets.adapter.rooms.get('room-0'));
    if (users) {
      const usersArray = Array.from(users);
      const opponent = usersArray[0] === client.id ? usersArray[1] : usersArray[0]
      const rightPlayer = this.players[0].id === opponent ? opponent : client.id;
      const leftPlayer = opponent !== rightPlayer ? client.id : opponent;
        this.pongService.startBroadcastingBallState(this.io, rightPlayer, leftPlayer);
    }
  };

  //ecoute les touche d'appuie sur les fleches
  @SubscribeMessage('paddleMovement1')
  handlePaddleMovement1(client: Socket, keycode: string): void {
      this.pongService.handleKeyCode1(keycode);
  }

  @SubscribeMessage('paddleMovement2')
  handlePaddleMovement2(client: Socket, keycode: string): void {
    this.pongService.handleKeyCode2(keycode);
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    this.logger.debug(await this.userService.getUser({username:"toto"}));
    this.logger.debug(payload);

  }
}
