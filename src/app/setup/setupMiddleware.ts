import type { Express } from 'express';
import express from 'express';
import cors from 'cors';
import { corsOptions } from '../config/corsOptions.config.js';
import { MQTTClient } from '../../mqtt/connection/index.js';
import { morganMiddleware } from '../../modules/shared/middlewares/morgan.middleware.js';
import { accessPointsTableListener } from '../../mqtt/models/index.js';

export const setupMiddleware = (app: Express): Express => {
  MQTTClient();

  accessPointsTableListener();

  app.use(morganMiddleware);

  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};
