import { Socket } from 'socket.io';
import { IUsers } from 'src/database/service/interface/users';

export interface PongSocket extends Socket {
  user: Partial<IUsers>;
}
