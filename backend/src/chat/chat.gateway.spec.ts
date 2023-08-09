import { INestApplication } from '@nestjs/common';
import SessionStoreModule from './session-store/session-store.module';
import ChatGateway from './chat.gateway';
import { createNestApp, expectEvent, getClientSocket } from './chat.helper';

const testedModule = {
  imports: [SessionStoreModule],
  providers: [ChatGateway]
};

describe('ChatGateway', () => {
  describe('App initilization', () => {
    let gateway: ChatGateway;
    let app: INestApplication;
    let logSpy: jest.SpyInstance;

    beforeAll(async () => {
      app = await createNestApp(testedModule);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');
      app.listen(3000);
    });

    afterAll(async () => {
      await app.close();
    });

    it('should initialize the app', () => {
      expect(gateway).toBeDefined();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('Initialized');
    });
  });

  describe('Single client connection', () => {
    let gateway: ChatGateway;
    let app: INestApplication;
    let logSpy: jest.SpyInstance;

    beforeEach(async () => {
      app = await createNestApp(testedModule);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');
      app.listen(3000);
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(async () => {
      await app.close();
    });

    it('should connect', async () => {
      const socket = getClientSocket({
        username: 'toto'
      });
      socket.connect();
      await expectEvent(socket, 'connect');
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
      socket.connect();
      await expectEvent(socket, 'connect_error');
    });

    it('sends all connected users (only the current user here)', async () => {
      const socket = getClientSocket({ username: 'toto' });
      socket.on('users', (data) => {
        expect(data.length).toBe(1);
        expect(data[0]).toHaveProperty('userID');
        expect(data[0]).toHaveProperty('username');
      });
      socket.connect();
      await expectEvent(socket, 'connect');
      socket.disconnect();
    });

    it('does not receive info about its own connection', async () => {
      const socket = getClientSocket({ username: 'toto' });
      socket.on('user connected', () => {
        fail('it should not reach here');
      });
      socket.connect();
      await expectEvent(socket, 'connect');
      socket.disconnect();
    });

    it('receives sessionID userID when connect', async () => {
      const socket = getClientSocket({ username: 'toto' });
      socket.on('session', (session) => {
        expect(session).toHaveProperty('userID');
        expect(session).toHaveProperty('sessionID');
      });
      socket.connect();
      await expectEvent(socket, 'connect');
      socket.disconnect();
    });

    it('can connect from multiple socket through the same user session', async () => {
      const socket0 = getClientSocket({ username: 'toto' });

      let session0: any;
      socket0.on('session', (session) => {
        session0 = session;
      });
      socket0.connect();
      await expectEvent(socket0, 'session');

      const socket1 = getClientSocket({
        username: 'toto',
        sessionID: session0.sessionID
      });

      let session1: any;
      socket1.on('session', (session) => {
        session1 = session;
      });
      socket1.connect();
      await expectEvent(socket1, 'session');

      expect(session1).toEqual(session0);

      socket0.disconnect();
      socket1.disconnect();
    });

    it('emit "user disconnected" on disconnection of a client', async () => {
      const client0 = getClientSocket({ username: 'toto' });
      const client1 = getClientSocket({ username: 'tata' });

      let session0: {
        userID: string;
        sessionID: string;
      };

      client0.on('session', (session) => {
        session0 = session;
      });

      client1.on('user disconnected', (data) => {
        expect(data).toBe(session0.userID);
      });

      client0.connect();
      client1.connect();
      await Promise.all([
        expectEvent(client0, 'connect'),
        expectEvent(client0, 'session'),
        expectEvent(client1, 'connect')
      ]);
      client0.disconnect();
      await expectEvent(client1, 'user disconnected');
      client1.disconnect();
    });
  });

  describe('At least one client connected', () => {
    let gateway: ChatGateway;
    let app: INestApplication;
    let logSpy: jest.SpyInstance;

    beforeEach(async () => {
      app = await createNestApp(testedModule);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');
      app.listen(3000);
      jest.clearAllMocks();
    });

    afterEach(async () => {
      await app.close();
    });

    it('already connected client receive new connected client information', async () => {
      const client0 = getClientSocket({ username: 'toto' });
      const client1 = getClientSocket({ username: 'tata' });

      client0.on('user connected', (data) => {
        expect(data).toHaveProperty('userID');
        expect(data).toHaveProperty('username');
        expect(data.username).toBe('tata');
      });

      client0.connect();
      await expectEvent(client0, 'connect');

      client1.connect();
      await expectEvent(client1, 'connect');

      await expectEvent(client0, 'user connected');

      client0.disconnect();
      client1.disconnect();
    });

    it('is possible to send private message to another client', async () => {
      const client0 = getClientSocket({ username: 'toto' });
      const client1 = getClientSocket({ username: 'tata' });

      interface Session {
        userID: string;
        sessionID: string;
      }

      let session0: Session;
      let session1: Session;

      client1.on('private message', (data) => {
        expect(data).toHaveProperty('content');
        expect(data).toHaveProperty('from');
        expect(data).toHaveProperty('to');
        expect(data.content).toBe('some private infos: 42');
        expect(data.from).toBe(session1.userID);
        expect(data.to).toBe(session0.userID);
      });

      client0.on('private message', (data) => {
        expect(data).toHaveProperty('content');
        expect(data).toHaveProperty('from');
        expect(data).toHaveProperty('to');
        expect(data.content).toBe('some private infos: 42');
        expect(data.from).toBe(session1.userID);
        expect(data.to).toBe(session0.userID);
      });

      client0.on('session', (session) => {
        session0 = session;
      });

      client1.on('session', (session) => {
        session1 = session;
      });

      client0.connect();
      await Promise.all([
        expectEvent(client0, 'connect'),
        expectEvent(client0, 'session')
      ]);

      client1.connect();
      await Promise.all([
        expectEvent(client1, 'connect'),
        expectEvent(client1, 'session')
      ]);

      client1.emit('private message', {
        content: 'some private infos: 42',
        to: session0.userID
      });

      await Promise.all([
        expectEvent(client0, 'private message'),
        expectEvent(client1, 'private message')
      ]);

      client0.disconnect();
      client1.disconnect();
    });

    it('other connected clients does not receive private message', async () => {
      const client0 = getClientSocket({ username: 'toto' });
      const client1 = getClientSocket({ username: 'tata' });
      const client2 = getClientSocket({ username: 'tata' });

      client2.on('private message', () => {
        fail('it should not reach here');
      });

      client0.connect();
      client1.connect();
      client2.connect();

      await Promise.all([
        expectEvent(client0, 'connect'),
        expectEvent(client1, 'connect'),
        expectEvent(client2, 'connect')
      ]);

      client0.emit('private message', {
        content: 'some private infos: 42',
        to: client1.id
      });

      await expectEvent(client1, 'private message');

      client0.disconnect();
      client1.disconnect();
      client2.disconnect();
    });
  });
});
