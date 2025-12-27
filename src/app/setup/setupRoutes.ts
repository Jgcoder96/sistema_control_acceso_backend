import type { Express } from 'express';
import { Router } from 'express';
import type { AppRoutes } from '../types/AppRoutes.type.js';
import { authRoute } from '../../modules/auth/routes/auth.route.js';

export const appRoutes: AppRoutes = {
  auth: authRoute(),
};

export const setupRoutes = (app: Express): Router => {
  const router = Router();

  router.use('/auth', appRoutes.auth);
  app.use('/api', router);

  return router;
};
