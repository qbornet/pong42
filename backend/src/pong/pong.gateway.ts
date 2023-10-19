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
import { PongService } from './pong.service';
import { WaitingRoomService } from './waiting-room/waiting-room.service';
import { Party } from './party/party';
import { PongSocket } from './pong.interface';

type RoomName = string;
type UserID = string;

@WebSocketGateway()
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private waitingRoom: WaitingRoomService,
    private pongService: PongService
  ) {}

  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialize');
  }

  private rooms: Map<RoomName | UserID, Party> = new Map();

  handleConnection(client: PongSocket): any {
    const party = this.rooms.get(client.user.id!);
    const isWaiting = this.waitingRoom.isAwaitingPlayer(client);
    if (isWaiting) {
      client.emit('playerRole', 1);
      return;
    }
    if (party && client.user) {
      this.logger.debug(party.partyName);
      client.join(party.partyName);
      client.emit('startGame', party.partyName);
    } else {
      const roomName = this.waitingRoom.getRoomName();
      this.pongService.initializeRoom(roomName);
      const isAdded = this.waitingRoom.addPlayer(client);
      if (isAdded) {
        client.join(roomName);
        client.emit('playerRole', 1);
      } else {
        const newParty = this.waitingRoom.getParty(client);
        if (newParty) {
          client.join(roomName);
          client.emit('playerRole', 2);
          this.io.to(roomName).emit('startGame', roomName);
          this.rooms.set(roomName, newParty);
          this.rooms.set(newParty.player1.socket.user.id!, newParty);
          this.rooms.set(newParty.player2.socket.user.id!, newParty);
        }
      }
      this.logger.debug(`New connection : ${client.id}`);
    }
  }

  handleDisconnect(client: PongSocket): any {
    this.logger.debug(`Disconnected : ${client.id}`);
  }

  @SubscribeMessage('playerReady')
  handlePlayerReady(client: PongSocket) {
    const party = this.rooms.get(client.user.id!);
    if (party) {
      const p1 = party.player1.socket.id;
      const p2 = party.player2.socket.id;
      const right = p1 === client.user.id ? p2 : p1;
      const left = p1 !== client.user.id ? p2 : p1;
      this.pongService.startBroadcastingBallState(
        this.io,
        right,
        left,
        party.partyName
      );
    }
  }

  @SubscribeMessage('paddleMovement1')
  handlePaddleMovement1(client: PongSocket, keycode: string): void {
    const party = this.rooms.get(client.user.id!);
    if (party) this.pongService.handleKeyCode1(keycode, party.partyName);
  }

  @SubscribeMessage('paddleMovement2')
  handlePaddleMovement2(client: PongSocket, keycode: string): void {
    const party = this.rooms.get(client.user.id!);
    if (party) this.pongService.handleKeyCode2(keycode, party.partyName);
  }
}
