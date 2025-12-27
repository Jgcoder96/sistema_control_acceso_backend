import type { transport } from 'winston';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { envs } from './envs.config.js';

const isDev = envs.NODE_ENV === 'development';

const loggerTransports: transport[] = [
  new transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  }),
];

if (isDev) {
  loggerTransports.push(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, code }) => {
          return `${timestamp} [${level}]: ${message} ${code ? `(${code})` : ''}`;
        }),
      ),
    }),
  );
}

export const logger = createLogger({
  level: isDev ? 'debug' : 'http',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json(),
  ),
  defaultMeta: { service: 'api' },
  transports: loggerTransports,
});
