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
import SessionStore from 'src/session-store/session-store';
import { randomBytes } from 'crypto';
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

  private readonly sessionStore: SessionStore;

  getLogger(): Logger {
    return this.logger;
  }

  @WebSocketServer() io: Server;

  afterInit() {
    this.io.use((socket: ChatSocket, next) => {
      const { sessionID } = socket.handshake.auth;
      if (sessionID) {
        const session = this.sessionStore.findSession(sessionID);
        if (session) {
          socket.sessionID = sessionID;
          socket.username = session.username;
          return next();
        }
      }
      const { username } = socket.handshake.auth;
      if (!username) {
        return next(new Error('invalid username'));
      }
      socket.sessionID = ChatGateway.randomId();
      socket.userID = ChatGateway.randomId();
      socket.username = username;
      return next();
    });
    this.logger.log('Initialized');
  }

  handleConnection(socket: ChatSocket, ...args: any[]) {
    this.logger.log(`Client id:${socket.id} connected`);
    this.logger.log(`Nb clients: ${this.io.sockets.sockets.size}`);
    const users: { userID: string; username: string }[] = [];
    socket.join(socket.userID);
    this.io.of('/').sockets.forEach((sckt: ChatSocket, id: string) => {
      users.push({
        userID: id,
        username: sckt.username
      });
    });
    socket.emit('users', users);
    socket.broadcast.emit('user connected', {
      userID: socket.id,
      username: socket.username
    });
    socket.emit('session', {
      sessionID: socket.sessionID,
      userID: socket.userID
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
    this.io.to(to).to(socket.userID).emit('private message', {
      content,
      from: socket.userID,
      to
    });
  }

  static randomId(): string {
    return randomBytes(8).toString('hex');
  }
}
