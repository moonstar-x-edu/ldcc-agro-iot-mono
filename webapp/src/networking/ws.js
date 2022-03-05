import { io } from 'socket.io-client';

const WS_URL = process.env.NODE_ENV === 'development' ?
  'ws://localhost:4000' :
  `wss://${window.location.host}`;

export const createSocket = () => {
  return io(WS_URL);
};
