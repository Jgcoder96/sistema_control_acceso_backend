import { Router } from 'express';
import type { Express } from 'express';

import { authRoute } from '../../modules/auth/routes/auth.route.js';
import type { AppRoutes } from '../types/AppRoutes.type.js';

export const appRoutes: AppRoutes = {
  auth: authRoute(),
};

export const setupRoutes = (app: Express): Router => {
  const router = Router();

  router.use('/auth', appRoutes.auth);
  app.use('/api', router);

  return router;
};
