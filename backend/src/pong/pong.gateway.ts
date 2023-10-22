import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PongSocket } from './pong.interface';
import { PongService } from './pong.service';
import { PartyClassic } from './party/party';

@WebSocketGateway()
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  constructor(private pongService: PongService) {}

  afterInit() {
    this.logger.log('Initialize');
  }

  handleConnection(client: PongSocket): any {
    const clientID = client.user.id!;
    const party = this.pongService.getParty(clientID);
    if (party) {
      client.join(party.partyName);

      if (this.pongService.isPlayer1(party, clientID)) {
        client.emit('playerRole', 1);
      } else {
        client.emit('playerRole', 2);
      }

      if (party.isStarted) {
        client.emit('startGame', party.partyName);
      } else {
        this.io.to(party.partyName).emit('joinParty');
      }
    } else if (this.pongService.isWaiting(client)) {
      client.join(this.pongService.getWaitingRoom().getRoomName());
      client.emit('joinWaitingRoom');
    }
    client.emit('gameState', PartyClassic.getInitGameState());
    this.logger.debug(`New connection : ${client.id}`);
  }

  handleDisconnect(client: PongSocket): any {
    this.logger.debug(`Disconnected : ${client.id}`);
  }

  @SubscribeMessage('joinWaitingRoom')
  handleJoinWaitingRoom(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.pongService.getParty(clientID);
    if (party) return;
    const hasJoin = this.pongService.joinWaintingRoom(client);
    if (hasJoin) {
      client.emit('playerRole', 1);
      client.emit('joinWaitingRoom');
    } else {
      const newParty = this.pongService.createParty(client);
      if (newParty) {
        client.join(newParty.partyName);
        client.emit('playerRole', 2);
        client.emit('joinWaitingRoom');
        this.io.to(newParty.partyName).emit('joinParty');
      }
    }
    client.emit('gameState', PartyClassic.getInitGameState());
  }

  @SubscribeMessage('playAgain')
  handlePlayAgain(client: PongSocket) {
    client.emit('gameOver', false);
    client.emit('gameState', PartyClassic.getInitGameState());
  }

  @SubscribeMessage('playerReady')
  handlePlayerReady(client: PongSocket) {
    const clientID = client.user.id!;
    const party = this.pongService.getParty(clientID);
    if (party) {
      const ready = this.pongService.setPlayerReady(clientID, party);
      client.emit('playerReady', ready);
      if (party.player1.isReady && party.player2.isReady) {
        const emitState = (state: any) => {
          this.io.to(party.partyName).emit('gameState', state);
        };
        const emitGameOver = () => {
          this.io.to(party.partyName).emit('gameOver', true);
        };
        this.pongService.startParty(clientID, emitState, emitGameOver);
        this.io.to(party.partyName).emit('startGame', party.partyName);
      }
    }
  }

  @SubscribeMessage('arrowUp')
  handleArrowUp(client: PongSocket, isPressed: boolean): void {
    this.pongService.handlePaddle(client.user.id!, 'ArrowUp', isPressed);
  }

  @SubscribeMessage('arrowDown')
  handleArrowDown(client: PongSocket, isPressed: boolean): void {
    this.pongService.handlePaddle(client.user.id!, 'ArrowDown', isPressed);
  }
}
