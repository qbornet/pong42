import { createServer } from 'http';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'socket.io';
import { AddressInfo } from 'net';
import Client, { io } from 'socket.io-client';
import ChatGateway from './chat.gateway';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let serverSocket;
  let clientSocket;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway]
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);

    const httpServer = createServer();
    gateway.io = new Server(httpServer);
    httpServer.listen(async () => {
      const { port }: AddressInfo = httpServer.address() as AddressInfo;
      clientSocket = io(`http://localhost:${port}`);
      gateway.io.on('connection', (socket) => {
        serverSocket = socket;
        console.log('Server connected !!!!!');
        a += 1;
      });
      clientSocket.on('connect', () => {
        console.log('Client connected !!!!!');
      });
    });
    clientSocket.connect();
  });

  beforeEach(() => { });

  afterAll(() => {
    gateway.io.close();
    clientSocket.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
