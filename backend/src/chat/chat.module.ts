import { Module } from '@nestjs/common';
import { Chat } from './chat';
import { ChatService } from './chat.service';
import ChatGateway from './chat.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateway, Chat, ChatService]
})
export default class ChatModule {}
