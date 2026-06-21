import { MqttClient } from 'mqtt';
import {
  handleDeviceSync,
  handleDeviceSyncSuccessful,
  handleDeviceAccessEvent,
} from '../subscriptions/index.js';

import { logger } from '../../config/index.js';
import { SUBSCRIPTION_TOPICS } from '../constants/index.js';

export const eventHandlers = (client: MqttClient): void => {
  const { DEVICE_SYNC_REQUEST, DEVICE_SYNC_SUCCESSFUL, DEVICE_ACCESS_EVENT } =
    SUBSCRIPTION_TOPICS;

  client.on('connect', () => {
    logger.info('[MQTT] Conexión establecida con éxito.');

    client.subscribe([
      DEVICE_SYNC_REQUEST,
      DEVICE_SYNC_SUCCESSFUL,
      DEVICE_ACCESS_EVENT,
    ]);
  });

  client.on('message', async (topic: string, message: Buffer) => {
    logger.info(`[MQTT] Mensaje recibido | Tópico: ${topic}.`);

    switch (topic) {
      case DEVICE_SYNC_REQUEST:
        await handleDeviceSync(client, message);
        break;

      case DEVICE_SYNC_SUCCESSFUL:
        await handleDeviceSyncSuccessful(message);
        break;

      case DEVICE_ACCESS_EVENT:
        await handleDeviceAccessEvent(message);
        break;

      default:
        break;
    }
  });

  client.on('error', (err) =>
    logger.error(`[MQTT] Error de conexión | Motivo: ${err.message}.`),
  );

  client.on('reconnect', () => logger.error(`[MQTT] Intentando reconectar...`));
};
