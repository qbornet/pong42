import { Injectable } from '@nestjs/common';
import { Status, UserID } from './pong.interface';

@Injectable()
export class PongService {
  private status: Map<UserID, Status> = new Map();

  getStatus(id: string) {
    return this.status.get(id);
  }
}
