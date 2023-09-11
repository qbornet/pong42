import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Socket, io } from 'socket.io-client';

export async function createNestApp(module: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule(module).compile();

  return testingModule.createNestApplication();
}

export function getClientSocket(auth: { [key: string]: any }): Socket {
  const socket = io('http://localhost:3000', {
    autoConnect: false,
    transports: ['websocket', 'polling']
  });
  socket.auth = auth;
  return socket;
}

export async function expectEvent(
  socket: Socket,
  event: string
): Promise<void> {
  return new Promise<void>((resolve) => {
    socket.on(event, () => {
      resolve();
    });
  });
}
