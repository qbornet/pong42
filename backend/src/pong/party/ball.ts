import { Canva } from './canva';
import { Game } from './game';
import { Paddle } from './paddle';
import { PositionClass } from './position';

export class Ball extends PositionClass {
  private speed: number = 1;

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.dy = Math.random() < 0.5 ? -1 : 1;
    this.dx = Math.random() < 0.5 ? -1 : 1;
  }

  updatePosition(paddle1: Paddle, paddle2: Paddle, canva: Canva, game: Game) {
    // gere la collision des parois hautes et basses
    if (this.y + this.height >= canva.height || this.y < 0) {
      this.dy = -this.dy;
    }

    // collision paroi droite
    if (this.x + this.width >= canva.width) {
      // this.logger.log('Joueur gauche a marque 1 Point !!!!!!!!!!!!');
      game.scorePlayer1 += 1;
      this.x = canva.width / 2 - this.width / 2;
      this.y = canva.height / 2 - this.height / 2;
    }

    // collision paroi gauche
    if (this.x <= 0) {
      // this.logger.log('joueur droit a marque 1 Point !!!!!!!!!!!!');
      game.scorePlayer2 += 1;
      this.x = canva.width / 2 - this.width / 2;
      this.y = canva.height / 2 - this.height / 2;
    }

    // collisions raquette droite
    if (this.x <= paddle1.x + paddle1.width) {
      if (
        this.y >= paddle1.y &&
        this.y + this.height <= paddle1.y + paddle1.height
      ) {
        this.dx = 1;
      }
    }

    // collisions raquette gauche
    if (this.x + this.width >= paddle2.x) {
      if (
        this.y >= paddle2.y &&
        this.y + this.height <= paddle2.y + paddle2.height
      ) {
        this.dx = -1;
      }
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
}
