import type { Express } from 'express';

import express from 'express';

export const setupMiddleware = (app: Express): Express => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};
