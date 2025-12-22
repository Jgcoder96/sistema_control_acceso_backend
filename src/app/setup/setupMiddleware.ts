import type { Express } from 'express';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { corsOptions } from '../config/corsOptions.config.js';
import { envs } from '../../config/envs.config.js';
import { MQTTClient } from '../../MQTT/connection/mqttClient.connection.js';

export const setupMiddleware = (app: Express): Express => {
  MQTTClient();

  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan('dev'));

  if (envs.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  return app;
};
