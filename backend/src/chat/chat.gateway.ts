import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';
import Config, { Env } from '../config/configuration';

function webSocketOptions() {
  const config = Config();
  if (config.env === Env.Dev) {
    return {
      cors: {
        origin: 'http://localhost:5173',
        transports: ['websocket', 'polling']
      }
    };
  }
  return {};
}

@WebSocketGateway(Config().port, webSocketOptions())
export default class ChatGateway {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    console.log(data);
    return data;
  }
}
