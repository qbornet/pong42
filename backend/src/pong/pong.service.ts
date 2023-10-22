import { Injectable, Logger } from '@nestjs/common';
import { PartyClassic } from './party/party';
import { WaitingRoomService } from './waiting-room/waiting-room.service';
import { PongSocket } from './pong.interface';
import { Game } from './party/game';

type RoomName = string;
type UserID = string;

@Injectable()
export class PongService {
  private readonly logger = new Logger(PongService.name);

  private rooms: Map<RoomName | UserID, PartyClassic> = new Map();

  constructor(private waitingRoom: WaitingRoomService) {}

  handlePaddle(clientID: string, keycode: string, isPressed: boolean) {
    const party = this.getParty(clientID);
    if (party) {
      party.movePaddle(clientID, keycode, isPressed);
    }
  }

  isWaiting(client: PongSocket) {
    return this.waitingRoom.isAwaitingPlayer(client);
  }

  getParty(clientID: string): Game | undefined {
    return this.rooms.get(clientID);
  }

  isPlayer1(party: Game, clientID: string) {
    return party.player1.socket.user.id === clientID;
  }

  getWaitingRoom() {
    return this.waitingRoom;
  }

  createParty(client: PongSocket) {
    const roomName = this.waitingRoom.getRoomName();
    const party = this.waitingRoom.getParty(client);
    if (party) {
      this.rooms.set(roomName, party);
      this.rooms.set(party.player1.socket.user.id!, party);
      this.rooms.set(party.player2.socket.user.id!, party);
    }
    return party;
  }

  joinWaintingRoom(client: PongSocket): boolean {
    const roomName = this.waitingRoom.getRoomName();
    const isAdded = this.waitingRoom.addPlayer(client);
    if (isAdded) {
      client.join(roomName);
      return true;
    }
    return false;
  }

  setPlayerReady(clientID: string, party: Game) {
    if (this.isPlayer1(party, clientID)) {
      party.player1.isReady = !party.player1.isReady;
      return party.player1.isReady;
    }
    party.player2.isReady = !party.player2.isReady;
    return party.player2.isReady;
  }

  startParty(
    clientID: string,
    emitState: (state: any) => void,
    emitGameOver: () => void
  ) {
    const party = this.rooms.get(clientID);
    if (party) {
      party.startBroadcastingBallState(emitState, () => {
        emitGameOver();
        this.rooms.delete(party.player1.socket.user.id!);
        this.rooms.delete(party.player2.socket.user.id!);
        this.rooms.delete(party.partyName);
      });
    }
  }
}
