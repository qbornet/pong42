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
  let gateway: ChatGateway;
  let app: INestApplication;
  let ioClient: Socket;
  let logSpy: jest.SpyInstance;

  beforeAll(async () => {
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

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the app', () => {
    expect(gateway).toBeDefined();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('Initialized');
  });

  it('should connect', async () => {
    ioClient.connect();
    await new Promise<void>((resolve) => {
      ioClient.on('connect', () => {
        resolve();
      });
    });
    expect(logSpy).toHaveBeenCalledTimes(2);
    ioClient.disconnect();
  });
});
