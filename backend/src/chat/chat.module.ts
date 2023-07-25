import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateway]
})
export default class ChatModule {}
