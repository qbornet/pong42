import { Module } from '@nestjs/common';
import SessionStoreModule from 'src/session-store/session-store.module';
import ChatGateway from './chat.gateway';

@Module({
  controllers: [],
  providers: [ChatGateway],
  imports: [SessionStoreModule]
})
export default class ChatModule {}
