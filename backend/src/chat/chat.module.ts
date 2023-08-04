import { Module } from '@nestjs/common';
import SessionStoreModule from 'src/session-store/session-store.module';
import ChatService from './chat.service';
import ChatGateway from './chat.gateway';

@Module({
  imports: [SessionStoreModule],
  controllers: [],
  providers: [ChatGateway, ChatService]
})
export default class ChatModule {}
