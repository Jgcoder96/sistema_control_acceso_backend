import { Server } from 'socket.io';
import { Server as ServerHttp } from 'http';
import { startEventListener } from './events/startEventListener.js';

export const initWss = (server: ServerHttp): Server => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  startEventListener(io);
  return io;
};
