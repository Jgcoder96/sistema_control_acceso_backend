import type { Express } from 'express';
import express from 'express';
import cors from 'cors';
import { corsOptions } from '../config/corsOptions.config.js';
import { MQTTClient } from '../../MQTT/connection/mqttClient.connection.js';
import { morganMiddleware } from '../../modules/shared/middlewares/morgan.middleware.js';

export const setupMiddleware = (app: Express): Express => {
  MQTTClient();

  app.use(morganMiddleware);

  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};
