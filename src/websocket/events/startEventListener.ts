import { Server } from 'socket.io';

export const startEventListener = (wss: Server): void => {
  wss.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('chat message', (msg) => {
      console.log('Mensaje: ' + msg);

      wss.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Un usuario se ha desconectado');
    });
  });
};
