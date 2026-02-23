import { authRoute } from '../../modules/auth/routes/auth.route.js';
import { configRoute } from '../../modules/config/routes/index.js';
import { envs } from '../../config/index.js';
import { Router } from 'express';
import { swaggerConfig } from '../../docs/swaggerConfig.docs.js';
import swaggerUi from 'swagger-ui-express';
import type { AppRoutes } from '../types/AppRoutes.type.js';
import type { Express } from 'express';

export const appRoutes: AppRoutes = {
  auth: authRoute(),
  config: configRoute(),
};

export const setupRoutes = (app: Express): Router => {
  const router = Router();

  if (envs.NODE_ENV !== 'production') {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
  }

  router.use('/auth', appRoutes.auth);

  router.use('/config', appRoutes.config);

  app.use('/api', router);

  return router;
};
