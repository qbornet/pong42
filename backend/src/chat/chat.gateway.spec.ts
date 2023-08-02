import { Test, TestingModule } from '@nestjs/testing';
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

  beforeEach(async () => {
    app = await createNestApp(ChatGateway);
    gateway = app.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', async () => {
    expect(gateway).toBeDefined();
  });
});
