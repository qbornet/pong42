import { Canva } from './canva';
import { Game } from './game';
import { Paddle } from './paddle';
import { PositionClass } from './position';

interface BallState {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

export class Ball extends PositionClass {
  private speed: number = 10;

  private radius: number;

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.dx = Math.random() < 0.5 ? -1 : 1;
    this.dy = 1;
    this.radius = h;
  }

  getBallState(): BallState {
    return {
      x: this.x,
      y: this.y,
      radius: this.radius,
      dx: this.dx,
      dy: this.dy
    };
  }

  updatePosition(paddle1: Paddle, paddle2: Paddle, canva: Canva, game: Game) {
    // gere la collision des parois hautes et basses
    if (this.y + this.radius > canva.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    // collisions raquette gauche
    if (
      this.x - this.radius < this.x + this.width &&
      this.y + this.radius > paddle1.y &&
      this.y - this.radius < paddle1.y + paddle1.height
    ) {
      this.dx = -this.dx;
      const relativeIntersectY = this.y - (paddle1.y + 50);
      const normalizedIntersectY = relativeIntersectY / 50;
      const bounceAngle = normalizedIntersectY * (45 * (Math.PI / 180));

      this.dy = 2 * Math.sin(bounceAngle);
    }

    // collisions raquette droite
    if (
      this.x + this.radius > paddle2.x &&
      this.y + this.radius > paddle2.y &&
      this.y - this.radius < paddle2.y + paddle2.height
    ) {
      this.dx = -this.dx;
      const relativeIntersectY = this.y - (paddle2.y + 50);
      const normalizedIntersectY = relativeIntersectY / 50;
      const bounceAngle = normalizedIntersectY * (45 * (Math.PI / 180));

      this.dy = 2 * Math.sin(bounceAngle);
    }

    // collision paroi droite
    if (this.x + this.radius > canva.width) {
      // this.logger.log('Joueur gauche a marque 1 Point !!!!!!!!!!!!');
      game.scorePlayer1 += 1;
      this.x = canva.width / 2 - this.width / 2;
      this.y = canva.height / 2 - this.height / 2;
    }

    // collision paroi gauche
    if (this.x + this.radius < 0) {
      // this.logger.log('joueur droit a marque 1 Point !!!!!!!!!!!!');
      game.scorePlayer2 += 1;
      this.x = canva.width / 2 - this.width / 2;
      this.y = canva.height / 2 - this.height / 2;
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
}
