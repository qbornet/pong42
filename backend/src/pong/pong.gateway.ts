import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';
import { UsersService } from 'src/database/service/users.service';
import { PongService } from './pong.service';

@WebSocketGateway(4000, { cors: true })
export class PongGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }

  //tableau de joueurs 
  private players: Array<Socket> = [];

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
    if (this.players.length === 0) {
      this.players.push(client);
      client.emit('playerRole', 1);
    } else if (this.players.length === 1) {
      this.players.push(client);
      client.emit('playerRole', 2);
    }
    else if (this.players.length === 2) {
      client.emit('errorMessage', 'Room is full');
      client.disconnect();
    }

    this.logger.debug('New connection : '+ client.id);
  }

  handleDisconnect(client: any): any {
    this.logger.debug('Disconnected : ' + client.id + ' Reason: ' + client.reason);
  }

  @SubscribeMessage('playerReady')
  handlePlayerReady() {
    this.isReady = true;
    this.pongService.startBroadcastingBallState(this.io);
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
