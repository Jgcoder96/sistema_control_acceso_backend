import { MqttClient } from 'mqtt';
import { logger } from '../../config/logger.config.js';

export const eventHandlers = (client: MqttClient) => {
  client.on('connect', () => {
    logger.info('Servicio MQTT: Conectado exitosamente');
    client.subscribe('mesh/config', (err) => {
      if (!err) {
        console.log(`Suscrito con éxito`);
      } else {
        console.error('Error al suscribirse:', err);
      }
    });
  });

  client.on('message', (topic, message) => {
    // El mensaje llega como un Buffer, hay que convertirlo a string
    console.log(`Nuevo mensaje en el tópico [${topic}]: ${message.toString()}`);

    // Si el mensaje es un JSON, puedes parsearlo así:
    // const data = JSON.parse(message.toString());
  });

  client.on('reconnect', () => {
    logger.warn('Servicio MQTT: Re-conectando...');
  });

  client.on('error', (err) => {
    logger.error(`Servicio MQTT Error: ${err.message}`);
  });

  client.on('offline', () => {
    logger.warn('Servicio MQTT: Desconectado (Offline)');
  });
};
