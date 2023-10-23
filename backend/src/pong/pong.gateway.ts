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
import { PartyClassic } from './party/party';
import { ClassicWaitingRoom } from './waiting-room/waiting-room';

@WebSocketGateway()
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  constructor(private waitingRoomService: ClassicWaitingRoom) {}

  afterInit() {
    this.logger.log('Initialize');
  }

  handleConnection(client: PongSocket): any {
    const clientID = client.user.id!;
    const party = this.waitingRoomService.getParty(clientID);
    if (party) {
      client.join(party.partyName);

      const role = party.isPlayer1(clientID) ? 1 : 2;
      client.emit('playerRole', role);

      if (party.isStarted) {
        client.emit('startGame', party.partyName);
      } else {
        this.io.to(party.partyName).emit('joinParty');
      }
    } else if (this.waitingRoomService.isUserWaiting(clientID)) {
      client.join(this.waitingRoomService.getRoomName());
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
    const party = this.waitingRoomService.getParty(clientID);
    if (party) return;

    const newParty = this.waitingRoomService.joinParty(client, this.io);
    if (newParty) {
      client.emit('playerRole', 2);
      client.emit('joinWaitingRoom');
      this.io.to(newParty.partyName).emit('joinParty');
    } else {
      client.emit('playerRole', 1);
      client.emit('joinWaitingRoom');
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
    const party = this.waitingRoomService.getParty(clientID);
    if (party) {
      const ready = party.togglePlayerReady(clientID);
      client.emit('playerReady', ready);
      party.startParty(() => {
        this.waitingRoomService.removeParty(party.partyName);
        this.waitingRoomService.removeParty(party.player2.id);
        this.waitingRoomService.removeParty(party.player1.id);
      });
    }
  }

  @SubscribeMessage('arrowUp')
  handleArrowUp(client: PongSocket, isPressed: boolean): void {
    const party = this.waitingRoomService.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowUp', isPressed);
    }
  }

  @SubscribeMessage('arrowDown')
  handleArrowDown(client: PongSocket, isPressed: boolean): void {
    const party = this.waitingRoomService.getParty(client.user.id!);
    if (party) {
      party.movePaddle(client.user.id!, 'ArrowDown', isPressed);
    }
  }
}
