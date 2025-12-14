import { config } from 'dotenv';
import env from 'env-var';

config();

export const envs = {
  PORT: env.get('APP_PORT').required().asPortNumber(),
  NODE_ENV: env.get('NODE_ENV').required().asString(),

  MQTT_BROKER_URL: env.get('MQTT_BROKER_URL').required().asString(),
  MQTT_BROKER_PORT: env.get('MQTT_BROKER_PORT').required().asPortNumber(),
};
