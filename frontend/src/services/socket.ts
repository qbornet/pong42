import { io, Socket } from 'socket.io-client';

interface PongSocket extends Socket {
  userID: string;
}

const devURL = 'http://localhost:3000';
const URL = process.env.NODE_ENV === 'prod' ? devURL : devURL;

const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
}) as PongSocket;

socket.onAny((event, ...args) => {
  /* eslint-disable */
  console.log('connected');
  console.log(event, args);
  /* eslint-enable */
});

export default socket;
