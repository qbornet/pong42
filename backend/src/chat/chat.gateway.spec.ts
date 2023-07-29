import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { vi } from 'vitest';
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

  it('should log "Initialized" after instanciation', async () => {
    const logSpy = vi.spyOn(gateway, 'afterInit').mockImplementation(() => {});
    await app.listen(3000);
    expect(logSpy).toBeCalled();
  });
});
