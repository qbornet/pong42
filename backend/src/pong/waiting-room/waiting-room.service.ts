import { Injectable } from '@nestjs/common';
import { PongSocket } from '../pong.interface';
import { PartyClassic } from '../party/party';
import { Player } from '../party/player';

@Injectable()
export class WaitingRoomService {
  private roomCounter: number = 0;

  private player: Player | undefined;

  private roomName: string = 'room-0';

  isAwaitingPlayer(s: PongSocket) {
    if (this.player) {
      return s.user.id === this.player?.socket.user.id;
    }
    return false;
  }

  getRoomName() {
    return this.roomName;
  }

  addPlayer(s: PongSocket): boolean {
    if (this.player === undefined) {
      this.player = new Player(s, 1);
      return true;
    }
    if (this.player.socket.user.id === s.user.id) {
      return true;
    }
    return false;
  }

  getParty(s: PongSocket): PartyClassic | undefined {
    if (this.player !== undefined) {
      const player2 = new Player(s, 2);
      const party = new PartyClassic(this.player, player2, this.roomName);
      this.roomCounter += 1;
      this.roomName = `room-${this.roomCounter}`;
      this.player = undefined;
      return party;
    }
    return undefined;
  }
}
