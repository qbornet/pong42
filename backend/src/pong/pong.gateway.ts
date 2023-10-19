import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/database/service/users.service';
import { PongService } from './pong.service';
import { WaitingRoomService } from './waiting-room/waiting-room.service';
import { Party, Player, PongSocket} from './waiting-room/waiting-room.service';

type RoomName = string;
type UserID = string;

@WebSocketGateway()
export class PongGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  isReady: boolean;
  constructor(
      private waitingRoom: WaitingRoomService,
      private userService: UsersService,
      private pongService: PongService
    ) {
    this.isReady = false;
  };
  private readonly logger = new Logger(PongGateway.name);

  @WebSocketServer() io: Server;

  afterInit(server: any) {
    this.logger.log('Initialize');
  }
  
  private rooms: Map<RoomName | UserID, Party> = new Map();

  handleConnection(client: PongSocket, ...args: any[]): any {
    const party = this.rooms.get(client.user.id!);
    // this.logger.debug(party)
    if (this.waitingRoom.isAwaitingPlayer(client)) {
      client.emit('playerRole', 1);
      return ;
    }
    if (party && client.user) {
      this.logger.debug(party.partyName)
      client.join(party.partyName);
      client.emit("startGame", party.partyName)
    } else {
      const roomName = this.waitingRoom.getRoomName();
      this.pongService.initializeRoom(roomName);
      const isAdded = this.waitingRoom.addPlayer(client);
      if (isAdded) {
        client.join(roomName);
        client.emit('playerRole', 1);
      } else {
        const party = this.waitingRoom.getParty(client)
        if (party) {
          client.join(roomName);
          client.emit('playerRole', 2);
          this.io.to(roomName).emit('startGame', roomName);
          this.rooms.set(roomName, party);
          this.rooms.set(party.player1.socket.user.id!, party);
          this.rooms.set(party.player2.socket.user.id!, party);
        }
      }
      this.logger.debug('New connection : '+ client.id);
    }
  }

  handleDisconnect(client: any): any {
    this.logger.debug('Disconnected : ' + client.id + ' Reason: ' + client.reason);
    // if (this.waitingRoom && this.waitingRoom.player.id === client.id) {
    //   this.waitingRoom = null;
    // }
  }

  @SubscribeMessage('playerReady')
  handlePlayerReady(client: PongSocket) {
    const party = this.rooms.get(client.user.id!);
    if (party) {
      const p1 = party.player1.socket.id;
      const p2 = party.player2.socket.id;
      const right = p1 === client.user.id ? p2 : p1;
      const left = p1 !== client.user.id ? p2 : p1;
      this.pongService.startBroadcastingBallState(this.io, right, left, party.partyName);
    }
  };

  //ecoute les touche d'appuie sur les fleches
  @SubscribeMessage('paddleMovement1')
  handlePaddleMovement1(client: PongSocket, keycode: string): void {
    const party = this.rooms.get(client.user.id!);
    if (party)
      this.pongService.handleKeyCode1(keycode, party.partyName);
  }

  @SubscribeMessage('paddleMovement2')
  handlePaddleMovement2(client: PongSocket, keycode: string): void {
    const party = this.rooms.get(client.user.id!);
    if (party)
     this.pongService.handleKeyCode2(keycode, party.partyName);
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    this.logger.debug(await this.userService.getUser({username:"toto"}));
    this.logger.debug(payload);

  }
}
