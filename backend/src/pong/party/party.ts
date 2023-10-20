import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { Canva } from './canva';
import { Player } from './player';
import { Ball } from './ball';
import { Game } from './game';
import { Paddle } from './paddle';

const BALLSIZE = 10;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const WALL_OFFSET = 20;
const CANVA_WIDTH = 1200;
const CANVA_HEIGHT = 700;

export class PartyClassic extends Game {
  private readonly logger: Logger = new Logger(PartyClassic.name);

  // Ball
  private ball: Ball;

  // Paddle

  private paddle2: Paddle;

  private paddle1: Paddle;

  // Canva
  private canva: Canva;

  constructor(p1: Player, p2: Player, name: string) {
    super(p1, p2, name);
    this.canva = new Canva(0, 0, CANVA_WIDTH, CANVA_HEIGHT);

    this.ball = new Ball(
      CANVA_WIDTH / 2 - BALLSIZE / 2,
      CANVA_HEIGHT / 2 - BALLSIZE / 2,
      BALLSIZE,
      BALLSIZE
    );
    this.paddle1 = new Paddle(
      WALL_OFFSET,
      CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
    this.paddle2 = new Paddle(
      CANVA_WIDTH - (WALL_OFFSET + PADDLE_WIDTH),
      CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
  }

  updatePaddle1(keycode: string) {
    this.paddle1.handleKeyPress(keycode, this.canva);
  }

  updatePaddle2(keycode: string) {
    this.paddle2.handleKeyPress(keycode, this.canva);
  }

  public static getInitGameState() {
    return {
      ball: {
        x: CANVA_WIDTH / 2 - BALLSIZE / 2,
        y: CANVA_HEIGHT / 2 - BALLSIZE / 2
      },
      leftPaddle: {
        x: WALL_OFFSET,
        y: CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT
      },
      rightPaddle: {
        x: CANVA_WIDTH - (WALL_OFFSET + PADDLE_WIDTH),
        y: CANVA_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT
      },
      canva: {
        width: CANVA_WIDTH,
        height: CANVA_HEIGHT
      },
      scorePlayer1: 0,
      scorePlayer2: 0
    };
  }

  startBroadcastingBallState(io: Server): void {
    setInterval(() => {
      this.ball.updatePosition(this.paddle1, this.paddle2, this.canva, this);
      // this.logger.log('ball pos : ', this.ball.getBallState());
    }, 5);
    setInterval(() => {
      const gameState = {
        ball: {
          x: this.ball.x,
          y: this.ball.y
        },
        rightPaddle: {
          x: this.paddle1.x,
          y: this.paddle1.y,
          width: this.paddle1.width,
          height: this.paddle1.height
        },
        leftPaddle: {
          x: this.paddle2.x,
          y: this.paddle2.y,
          width: this.paddle2.width,
          height: this.paddle2.height
        },
        canva: this.canva,
        scorePlayer1: this.scorePlayer1,
        scorePlayer2: this.scorePlayer2
      };
      io.to(this.partyName).emit('gameState', gameState);
    }, 21);
  }
}
