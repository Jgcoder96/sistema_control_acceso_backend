import type { IClientOptions } from 'mqtt';

import { envs } from '../../config/envs.js';

export const MQTT_BROKER_URL = envs.MQTT_BROKER_URL;

export const MQTT_OPTIONS = {
  brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
  options: {
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    // username: process.env.MQTT_USER, // Si tuvieras usuario
    // password: process.env.MQTT_PASSWORD,
  } as IClientOptions,
};
