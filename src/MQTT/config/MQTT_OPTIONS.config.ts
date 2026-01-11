import type { IClientOptions } from 'mqtt';
import { envs } from '../../config/envs.config.js';

export const MQTT_OPTIONS = {
  brokerUrl: `${envs.MQTT_BROKER_URL}:${envs.MQTT_BROKER_PORT}`,
  options: {
    reconnectPeriod: 5000,
    connectTimeout: 30 * 1000,
    // username: process.env.MQTT_USER, // Si tuvieras usuario
    // password: process.env.MQTT_PASSWORD,
  } as IClientOptions,
};
