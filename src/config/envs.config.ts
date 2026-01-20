import { config } from 'dotenv';
import env from 'env-var';

config();

export const envs = {
  PORT: env.get('APP_PORT').required().asPortNumber(),
  NODE_ENV: env.get('NODE_ENV').required().asString(),

  MQTT_BROKER_URL: env.get('MQTT_BROKER_URL').required().asString(),
  MQTT_BROKER_PORT: env.get('MQTT_BROKER_PORT').required().asPortNumber(),

  DATABASE_URL: env.get('DATABASE_URL').required().asString(),

  AWS_ACCESS_KEY_ID: env.get('AWS_ACCESS_KEY_ID').asString(),
  AWS_SECRET_ACCESS_KEY: env.get('AWS_SECRET_ACCESS_KEY').asString(),
  AWS_REGION: env.get('AWS_REGION').required().asString(),
  S3_BUCKET_NAME: env.get('S3_BUCKET_NAME').required().asString(),

  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
};
