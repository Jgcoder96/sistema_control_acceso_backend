import { eventHandlers } from './index.js';
import { MQTT_OPTIONS } from '../config/index.js';
import mqtt, { MqttClient } from 'mqtt';

let client: MqttClient | null = null;

export const MQTTClient = (): MqttClient => {
  if (client) return client;

  client = mqtt.connect(MQTT_OPTIONS.brokerUrl, MQTT_OPTIONS.options);

  eventHandlers(client);

  return client;
};

export const getClient = (): MqttClient | null => {
  return client;
};
