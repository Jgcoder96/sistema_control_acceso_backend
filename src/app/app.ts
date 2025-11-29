import express from 'express';
import { setupError } from './setup/setupErrors.js';
import { setupMiddleware } from './setup/setupMiddleware.js';
import { setupRoutes } from './setup/setupRoutes.js';

export const appExpress = () => {
  const app = express();

  setupMiddleware(app);
  setupRoutes(app);
  setupError(app);

  return app;
};
