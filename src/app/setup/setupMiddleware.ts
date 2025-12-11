import type { Express } from 'express';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { corsOptions } from '../config/corsOptions.config.js';
import { envs } from '../../config/envs.js';

export const setupMiddleware = (app: Express): Express => {
  app.use(cors(corsOptions));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (envs.NODE_ENV === 'produccion') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  return app;
};
