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

describe('ChatGateway', () => {
  describe('Single client connection', () => {
    let gateway: ChatGateway;
    let app: INestApplication;
    let ioClient: Socket;
    let logSpy: jest.SpyInstance;

    beforeEach(async () => {
      // Chat module initilization
      app = await createNestApp(ChatGateway);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');

      // Chat is now listening
      app.listen(3000);

      // Instance of the client that will test interact with the Chat gateway
      ioClient = io('http://localhost:3000', {
        autoConnect: false,
        transports: ['websocket', 'polling']
      });
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
      await new Promise<void>((resolve) => {
        ioClient.on('connect', () => {
          resolve();
        });
        ioClient.auth = { username: 'toto' };
        ioClient.connect();
        jest.clearAllMocks();
      });
      ioClient.disconnect();

      const { calls } = logSpy.mock;
      expect(logSpy).toHaveBeenCalledTimes(2);

      expect(calls[0].length).toBe(1);
      expect(calls[0][0]).toMatch('Client id:');

      expect(calls[1].length).toBe(1);
      expect(calls[1][0]).toMatch('Nb clients:');
    });

    it('cannot connect without username', async () => {
      await new Promise<void>((resolve) => {
        ioClient.on('connect', () => {
          resolve();
          fail('it should not reach here');
        });
        ioClient.on('connect_error', () => {
          resolve();
        });

        ioClient.connect();
      });
    });

    it('sends all connected users (only the current user here)', async () => {
      await new Promise<void>((resolve) => {
        ioClient.on('connect', () => {});
        ioClient.on('users', (data) => {
          expect(data.length).toBe(1);
          expect(data[0]).toHaveProperty('userID');
          expect(data[0]).toHaveProperty('username');
          resolve();
        });
        ioClient.auth = { username: 'toto' };
        ioClient.connect();
        jest.clearAllMocks();
      });
      ioClient.disconnect();
    });
  });
});
