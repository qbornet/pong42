import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { DatabaseModule } from 'src/database/database.module';
import { PongService } from './pong.service';
import { WaitingRoomService } from './waiting-room/waiting-room.service';

@Module({
  imports: [DatabaseModule],
  providers: [PongGateway, PongService, WaitingRoomService]
})
export class PongModule {}
