import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
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
  let logger: ChatGateway;

  beforeAll(async () => {
    logger = mockDeep<ChatGateway>();
    app = await createNestApp(ChatGateway, {
      provide: Logger,
      useValue: logger
    });
    gateway = app.get<ChatGateway>(ChatGateway);
    ioClient = io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket', 'polling']
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should initialize the app', () => {
    app.listen(3000);
    expect(logger.log).toHaveBeenCalled('initialized');
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should connect', async () => {
    ioClient.connect();
    await new Promise<void>((resolve) => {
      ioClient.on('connect', () => {
        resolve();
      });
    });
    ioClient.disconnect();
  });
});
