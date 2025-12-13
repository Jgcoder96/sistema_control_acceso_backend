import mqtt, { MqttClient } from 'mqtt';

import { eventHandlers } from './eventhandlers.connection.js';
import { MQTT_OPTIONS } from '../config/MQTT_OPTIONS.config.js';

let client: MqttClient | null = null;

export const MQTTClient = (): MqttClient => {
  if (client) return client;

  console.log('🔄 Conectando a MQTT...');

  client = mqtt.connect(MQTT_OPTIONS.brokerUrl, MQTT_OPTIONS.options);

  eventHandlers(client);

  return client;
};

export const getClient = (): MqttClient | null => {
  return client;
};
