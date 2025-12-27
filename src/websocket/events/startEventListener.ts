import { Server } from 'socket.io';
import { logger } from '../../config/logger.config.js';

export const startEventListener = (wss: Server): void => {
  wss.on('connection', (socket) => {
    logger.info('Nuevo usuario conectado');

    socket.on('chat message', (msg) => {
      console.log('Mensaje: ' + msg);

      wss.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      logger.info('Usuario desconectado');
    });
  });
};
