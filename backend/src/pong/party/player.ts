import { PongSocket } from '../pong.interface';

export class Player {
  constructor(s: PongSocket, r: 1 | 2) {
    this.socket = s;
    this.role = r;
  }

  socket: PongSocket;

  role: 1 | 2;
}
