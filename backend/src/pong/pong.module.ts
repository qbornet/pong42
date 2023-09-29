import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PongGateway]
})
export class PongModule {}
