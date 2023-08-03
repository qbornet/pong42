import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import Config, { Env } from '../config/configuration';
import { ChatSocket } from './chat.interface';

function webSocketOptions() {
  const config = Config();
  const options = {};
  if (config.env === Env.Dev) {
    return {
      cors: {
        origin: 'http://localhost:5173',
        transports: ['websocket', 'polling']
      },
      ...options
    };
  }
  return options;
}

@WebSocketGateway(Config().port, webSocketOptions())
export default class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  getLogger(): Logger {
    return this.logger;
  }

  @WebSocketServer() io: Server;

  afterInit() {
    this.io.use((socket: ChatSocket, next) => {
      const { username } = socket.handshake.auth;
      if (!username) {
        return next(new Error('invalid username'));
      }
      socket.username = username;
      return next();
    });
    this.logger.log('Initialized');
  }

  handleConnection(socket: ChatSocket, ...args: any[]) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id:${socket.id} connected`);
    this.logger.log(`Nb clients: ${sockets.size}`);

    const users: { userID: string; username: string }[] = [];
    this.io.of('/').sockets.forEach((s: Chat, id: string) => {
      users.push({
        userID: id,
        username: s.username
      });
    });
    socket.emit('users', users);
    socket.broadcast.emit('user connected', {
      userID: socket.id,
      username: socket.username
    });
  }

  handleDisconnect(socket: ChatSocket) {
    this.logger.log(`Client id:${socket.id} disconnected`);
  }

  @SubscribeMessage('private message')
  handlePrivateMessage(
    @MessageBody('to') to: string,
    @MessageBody('content') content: string,
    @ConnectedSocket() socket: ChatSocket
  ) {
    this.logger.log(
      `Incoming private message from ${to} with content: ${content}`
    );
    socket.to(to).emit('private message', {
      content,
      from: socket.id
    });
  }
}
