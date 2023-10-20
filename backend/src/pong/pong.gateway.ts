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
import { WaitingRoomService } from './waiting-room/waiting-room.service';
import { PongSocket } from './pong.interface';
import { PartyClassic } from './party/party';

type RoomName = string;
type UserID = string;

@WebSocketGateway()
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private waitingRoom: WaitingRoomService) {}

  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialize');
  }

  private rooms: Map<RoomName | UserID, PartyClassic> = new Map();

  handleConnection(client: PongSocket): any {
    const party = this.rooms.get(client.user.id!);
    if (party && client.user) {
      client.join(party.partyName);
      if (party.player1.socket.user.id === client.user.id) {
        client.emit('playerRole', 1);
      } else {
        client.emit('playerRole', 2);
      }
      client.emit('startGame', party.partyName);
    } else {
      const roomName = this.waitingRoom.getRoomName();
      const isAdded = this.waitingRoom.addPlayer(client);
      if (isAdded) {
        client.join(roomName);
        client.emit('playerRole', 1);
      } else {
        const newParty = this.waitingRoom.getParty(client);
        if (newParty) {
          client.join(roomName);
          this.rooms.set(roomName, newParty);
          this.rooms.set(newParty.player1.socket.user.id!, newParty);
          this.rooms.set(newParty.player2.socket.user.id!, newParty);
          client.emit('playerRole', 2);
          this.io.to(roomName).emit('startGame', roomName);
        }
      }
    }
    client.emit('gameState', PartyClassic.getInitGameState());
    this.logger.debug(`New connection : ${client.id}`);
  }

  handleDisconnect(client: PongSocket): any {
    this.logger.debug(`Disconnected : ${client.id}`);
  }

  @SubscribeMessage('playerReady')
  handlePlayerReady(client: PongSocket) {
    const party = this.rooms.get(client.user.id!);
    if (party) {
      party.startBroadcastingBallState(this.io);
    }
    client.emit('waintingRoom');
  }

  @SubscribeMessage('paddleMovement1')
  handlePaddleMovement1(client: PongSocket, keycode: string): void {
    const party = this.rooms.get(client.user.id!);
    if (party) party.updatePaddle1(keycode);
  }

  @SubscribeMessage('paddleMovement2')
  handlePaddleMovement2(client: PongSocket, keycode: string): void {
    const party = this.rooms.get(client.user.id!);
    if (party) party.updatePaddle2(keycode);
  }
}
