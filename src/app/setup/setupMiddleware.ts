import type { Express } from 'express';

import express from 'express';
import cors from 'cors';

import { corsOptions } from '../config/corsOptions.config.js';

export const setupMiddleware = (app: Express): Express => {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};
