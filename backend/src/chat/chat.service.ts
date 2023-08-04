import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import SessionStore from 'src/session-store/session-store.interface';
import { ChatSocket } from './chat.interface';

@Injectable()
export default class ChatService {
  public io: Server;

  private readonly sessionStore: SessionStore;

  setIoServer(server: Server) {
    this.io = server;
  }

  afterInit() {
    return this.io.use((socket: ChatSocket, next) => {
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
      socket.sessionID = ChatService.randomId();
      socket.userID = ChatService.randomId();
      socket.username = username;
      return next();
    });
  }

  handleConnection(socket: ChatSocket, ...args: any[]) {
    const users: { userID: string; username: string }[] = [];
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
  }

  static handlePrivateMessage(to: string, content: string, socket: ChatSocket) {
    socket.to(to).emit('private message', {
      content,
      from: socket.id
    });
  }

  static randomId(): string {
    return randomBytes(8).toString('hex');
  }
}
