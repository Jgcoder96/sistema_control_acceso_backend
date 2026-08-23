import { Server } from 'socket.io';
import { Server as ServerHttp } from 'http';
import { startEventListener } from './events/startEventListener.js';

let io: Server | null = null;

export const initWss = (server: ServerHttp): Server => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  startEventListener(io);
  return io;
};

export const getWss = (): Server => {
  if (!io) {
    throw new Error('El servidor de WebSocket no ha sido inicializado.');
  }
  return io;
};
