import { Server } from 'socket.io';
import { Player } from './player';

export abstract class Game {
  partyName: string;

  // Player1
  player1: Player;

  public scorePlayer1: number = 0;

  // Player2
  player2: Player;

  public scorePlayer2: number = 0;

  constructor(p1: Player, p2: Player, name: string) {
    this.player1 = p1;
    this.player2 = p2;
    this.partyName = name;
  }

  abstract startBroadcastingBallState(
    io: Server,
    rightPlayer: string,
    leftPlayer: string
  ): void;
}
