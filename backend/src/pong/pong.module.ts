import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { WaitingRoomService } from './waiting-room/waiting-room.service';

@Module({
  imports: [DatabaseModule],
  providers: [PongGateway, PongService, WaitingRoomService]
})
export class PongModule {}
