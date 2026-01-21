import morgan from 'morgan';
import { logger } from '../../../config/logger.config.js';

export const morganMiddleware = morgan(
  ':method :url :status :response-time ms',
  { stream: { write: (msg) => logger.http(msg.trim()) } },
);
