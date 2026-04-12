import { authRoute } from '../../modules/auth/routes/index.js';
import { cardsRoute } from '../../modules/cards/routes/index.js';
import { configRoute } from '../../modules/config/routes/index.js';
import { locationRoute } from '../../modules/location/routes/index.js';
import { envs } from '../../config/index.js';
import { Router } from 'express';
import { swaggerConfig } from '../../docs/swaggerConfig.docs.js';
import swaggerUi from 'swagger-ui-express';
import type { AppRoutes } from '../types/index.js';
import type { Express } from 'express';
import { accessPointsRoute } from '../../modules/access_points/routes/index.js';

export const appRoutes: AppRoutes = {
  auth: authRoute(),
  config: configRoute(),
  cards: cardsRoute(),
  location: locationRoute(),
  accessPoints: accessPointsRoute(),
};

export const setupRoutes = (app: Express): Router => {
  const router = Router();

  if (envs.NODE_ENV !== 'production') {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
  }

  router.use('/auth', appRoutes.auth);

  router.use('/cards', appRoutes.cards);

  router.use('/location', appRoutes.location);

  router.use('/access-points', appRoutes.accessPoints);

  router.use('/config', appRoutes.config);

  app.use('/api', router);

  return router;
};
