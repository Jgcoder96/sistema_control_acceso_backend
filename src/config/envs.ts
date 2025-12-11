import { config } from 'dotenv';
import env from 'env-var';

config();

export const envs = {
  PORT: env.get('APP_PORT').default('3000').asPortNumber(),
  NODE_ENV: env.get('NODE_ENV').default('desarrollo').asString(),
};
