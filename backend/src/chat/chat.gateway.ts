import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
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
export default class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(ChatGateway.name);

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(data) {}
}
