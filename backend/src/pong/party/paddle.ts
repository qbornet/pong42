import { Canva } from './canva';
import { PositionClass } from './position';

interface PaddleState {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}

export class Paddle extends PositionClass {
  private speed: number = 10;

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.dx = 0;
    this.dy = 0;
  }

  getPaddleState(): PaddleState {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      dy: this.dy
    };
  }

  handleKeyPress(keycode: string, canva: Canva) {
    if (keycode === 'ArrowUp') {
      this.dy = -1;
      if (this.y < 0) {
        this.y = 0;
      }
    } else if (keycode === 'ArrowDown') {
      this.dy = 1;
      if (this.y + this.height > canva.height) {
        this.y = canva.height - this.height;
      }
    } else {
      this.dy = 0;
    }
    this.y += this.dy * this.speed;
  }
}
