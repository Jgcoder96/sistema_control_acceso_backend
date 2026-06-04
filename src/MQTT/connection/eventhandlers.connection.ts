import { MqttClient } from 'mqtt';
import {
  handleDeviceSync,
  handleDeviceSyncSuccessful,
} from '../subscriptions/index.js';

export const eventHandlers = (client: MqttClient): void => {
  client.on('connect', () => {
    console.info('🚀 MQTT Conectado');
    client.subscribe([
      'device/sync/request',
      'device/sync/successful',
      'mesh/config',
    ]);
  });

  client.on('message', async (topic: string, message: Buffer) => {
    switch (topic) {
      case 'device/sync/request':
        await handleDeviceSync(client, message);
        break;

      case 'device/sync/successful':
        await handleDeviceSyncSuccessful(message);
        break;

      case 'mesh/config':
        console.info('Tópico mesh/config recibido.');
        break;

      default:
        console.warn(`Tópico no reconocido: ${topic}`);
        break;
    }
  });

  client.on('error', (err) => console.error(`🚨 Error MQTT: ${err.message}`));

  client.on('reconnect', () => console.warn('🔄 Re-conectando...'));
};
