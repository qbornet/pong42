import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';
import { UsersService } from 'src/database/service/users.service';

@WebSocketGateway(4000, { cors: true })
export class PongGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
  constructor(private userService: UsersService) {};
//
  private ballState = {
    x: 600,
    y: 350,
    radius: 5,
    dx: 4,
    dy: 4,
  };
  private gameInterval: NodeJS.Timeout;
//
  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  afterInit(server: any) {
    this.logger.log('Initialize');

    // Commence à diffuser l'état de la balle lorsque le WebSocket est initialisé
    this.startBroadcastingBallState();
  }

  startBroadcastingBallState() {
    this.gameInterval = setInterval(() => {
      // Mettre à jour l'état de la balle ici (c'est un exemple simple)
      this.ballState.x += this.ballState.dx;
      this.ballState.y += this.ballState.dy;

      //gere la collision des parois hautes et basses
      if (
        this.ballState.y + this.ballState.radius > 700 ||
        this.ballState.y - this.ballState.radius < 0
      ) {
        this.ballState.dy = -this.ballState.dy;
      }

      //reinitalisation pos ball quand point marque
      if (this.ballState.x + this.ballState.radius > 1200)
      {
        this.logger.log('+1 Point !!!!!!!!!!!!')
        this.ballState.x = 600;
        this.ballState.y = 350;
      }
      if (this.ballState.x + this.ballState.radius < 0)
      {
        this.logger.log('+1 Point !!!!!!!!!!!!')
        this.ballState.x = 600;
        this.ballState.y = 350;
      }
      // Diffuser l'état de la balle à tous les clients
      this.io.emit('ballState', this.ballState);
    }, 100); // met à jour toutes les 100 ms, à ajuster selon les besoins
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.debug('New connection : '+ client.id);
  }

  handleDisconnect(client: any): any {
    this.logger.debug('Disconnected : ' + client.id + ' Reason: ' + client.reason);
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    this.logger.debug(await this.userService.getUser({username:"toto"}));
    this.logger.debug(payload);

  }

}
