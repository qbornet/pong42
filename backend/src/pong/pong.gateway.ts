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
  constructor(private userService: UsersService, private pongService: PongService) {};
  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  afterInit(server: any) {
    this.logger.log('Initialize');

    this.pongService.startBroadcastingBallState(this.io);
  }
  

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.debug('New connection : '+ client.id);
  }

  handleDisconnect(client: any): any {
    this.logger.debug('Disconnected : ' + client.id + ' Reason: ' + client.reason);
  }

  //ecoute les touche d'appuie sur les fleches
  @SubscribeMessage('paddleMovement')
  handlePaddleMovement(client: Socket, keycode: string): void {
    this.pongService.handlePaddleMovement(keycode);
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    this.logger.debug(await this.userService.getUser({username:"toto"}));
    this.logger.debug(payload);

  }

}
