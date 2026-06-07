import { MqttClient } from 'mqtt';
import {
  handleDeviceSync,
  handleDeviceSyncSuccessful,
} from '../subscriptions/index.js';

import { SUBSCRIPTION_TOPICS } from '../constants/subscriptionTopics.constant.js';

export const eventHandlers = (client: MqttClient): void => {
  const { DEVICE_SYNC_REQUEST, DEVICE_SYNC_SUCCESSFUL, MESH_CONFIG } =
    SUBSCRIPTION_TOPICS;

  client.on('connect', () => {
    console.info('🚀 MQTT Conectado');

    client.subscribe([
      DEVICE_SYNC_REQUEST,
      DEVICE_SYNC_SUCCESSFUL,
      MESH_CONFIG,
    ]);
  });

  client.on('message', async (topic: string, message: Buffer) => {
    switch (topic) {
      case DEVICE_SYNC_REQUEST:
        await handleDeviceSync(client, message);
        break;

      case DEVICE_SYNC_SUCCESSFUL:
        await handleDeviceSyncSuccessful(message);
        break;

      case MESH_CONFIG:
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
