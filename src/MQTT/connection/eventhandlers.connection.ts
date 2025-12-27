import { MqttClient } from 'mqtt';
import { logger } from '../../config/logger.config.js';

export const eventHandlers = (client: MqttClient) => {
  client.on('connect', () => {
    logger.info('Servicio MQTT: Conectado exitosamente');
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
