import { Server } from 'socket.io';
import { Canva } from './canva';
import { Player } from './player';
import { Ball } from './ball';
import { Game } from './game';
import { Paddle } from './paddle';

export class PartyClassic extends Game {
  // Ball
  private ball: Ball;

  // Canva
  private canva: Canva;

  private paddle2: Paddle;

  private paddle1: Paddle;

  constructor(p1: Player, p2: Player, name: string) {
    super(p1, p2, name);
    this.canva = new Canva(0, 0, 1200, 700);

    const paddleWidth: number = 10;
    const paddleHeight: number = 100;
    const ballSize: number = 10;
    const wallOffset: number = 20;

    this.ball = new Ball(
      this.canva.width / 2 - ballSize / 2,
      this.canva.height / 2 - ballSize / 2,
      ballSize,
      ballSize
    );
    this.paddle1 = new Paddle(
      wallOffset,
      this.canva.height / 2 - paddleHeight / 2,
      paddleWidth,
      paddleHeight
    );
    this.paddle2 = new Paddle(
      this.canva.width - (wallOffset + paddleWidth),
      this.canva.height / 2 - paddleHeight / 2,
      paddleWidth,
      paddleHeight
    );
  }

  updatePaddle1(keycode: string) {
    this.paddle1.handleKeyPress(keycode, this.canva);
  }

  updatePaddle2(keycode: string) {
    this.paddle2.handleKeyPress(keycode, this.canva);
  }

  startBroadcastingBallState(
    io: Server,
    rightPlayer: string,
    leftPlayer: string
  ): void {
    setInterval(() => {
      this.ball.updatePosition(this.paddle1, this.paddle2, this.canva, this);
      io.to(this.partyName).emit('ballState', this.ball.getBallState());
      io.to(rightPlayer).emit('paddleRight', this.paddle1.getPaddleState());
      io.to(leftPlayer).emit('paddleLeft', this.paddle2.getPaddleState());
    }, 3);
  }
}
