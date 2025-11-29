import { config } from 'dotenv';
import env from 'env-var';

config();

export const envs = {
  PORT: env.get('APP_PORT').default('3000').asPortNumber(),
};
