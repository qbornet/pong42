import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { DatabaseModule } from 'src/database/database.module';
import { PongService } from './pong.service';

@Module({
  imports: [DatabaseModule],
  providers: [PongGateway, PongService]
})
export class PongModule {}
