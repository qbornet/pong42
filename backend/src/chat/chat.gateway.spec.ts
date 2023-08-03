import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import ChatGateway from './chat.gateway';

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways
  }).compile();

  return testingModule.createNestApplication();
}

function getClientSocket(auth: { [key: string]: any }): Socket {
  const socket = io('http://localhost:3000', {
    autoConnect: false,
    transports: ['websocket', 'polling']
  });
  socket.auth = auth;
  return socket;
}

describe('ChatGateway', () => {
  describe('Single client connection', () => {
    let gateway: ChatGateway;
    let app: INestApplication;
    let logSpy: jest.SpyInstance;

    beforeEach(async () => {
      // Chat module initilization
      app = await createNestApp(ChatGateway);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');

      // Chat is now listening
      app.listen(3000);
    });

    afterEach(async () => {
      await app.close();
      jest.clearAllMocks();
    });

    it('should initialize the app', () => {
      expect(gateway).toBeDefined();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('Initialized');
    });

    it('should connect', async () => {
      const socket = getClientSocket({
        username: 'toto'
      });
      await new Promise<void>((resolve) => {
        socket.on('connect', () => {
          resolve();
        });
        socket.connect();
        jest.clearAllMocks();
      });
      socket.disconnect();

      const { calls } = logSpy.mock;
      expect(logSpy).toHaveBeenCalledTimes(2);

      expect(calls[0].length).toBe(1);
      expect(calls[0][0]).toMatch('Client id:');

      expect(calls[1].length).toBe(1);
      expect(calls[1][0]).toMatch('Nb clients:');
    });

    it('cannot connect without username', async () => {
      const socket = getClientSocket({});
      await new Promise<void>((resolve) => {
        socket.on('connect', () => {
          resolve();
          fail('it should not reach here');
        });
        socket.on('connect_error', () => {
          resolve();
        });

        socket.connect();
      });
    });

    it('sends all connected users (only the current user here)', async () => {
      const socket = getClientSocket({ username: 'toto' });
      await new Promise<void>((resolve) => {
        socket.on('connect', () => {});
        socket.on('users', (data) => {
          expect(data.length).toBe(1);
          expect(data[0]).toHaveProperty('userID');
          expect(data[0]).toHaveProperty('username');
          resolve();
        });
        socket.connect();
        jest.clearAllMocks();
      });
      socket.disconnect();
    });

    it('does not receive info about its own connection', async () => {
      const socket = getClientSocket({ username: 'toto' });
      await new Promise<void>((resolve) => {
        socket.on('connect', () => {
          resolve();
        });
        socket.on('user connected', () => {
          fail('it should not reach here');
        });
        socket.connect();
        jest.clearAllMocks();
      });
      socket.disconnect();
    });
  });
  describe('At least one client connected', () => {
    let gateway: ChatGateway;
    let app: INestApplication;
    let socket: Socket;
    let logSpy: jest.SpyInstance;

    beforeEach(async () => {
      // Chat module initilization
      app = await createNestApp(ChatGateway);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');

      // Chat is now listening
      app.listen(3000);

      socket = getClientSocket({ username: 'toto' });
      socket.connect();
    });

    afterEach(async () => {
      socket.disconnect();
      await app.close();
      jest.clearAllMocks();
    });

    it('should initialize the app', () => {
      expect(gateway).toBeDefined();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('Initialized');
    });
  });
});
