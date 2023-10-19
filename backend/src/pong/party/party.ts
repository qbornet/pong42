import { Player } from '../player/player';

export class Party {
  constructor(p1: Player, p2: Player, name: string) {
    this.player1 = p1;
    this.player2 = p2;
    this.partyName = name;
  }

  player1: Player;

  player2: Player;

  partyName: string;
}
