import { accessPointsRoute } from '../../modules/access_points/routes/index.js';
import { authRoute } from '../../modules/auth/routes/index.js';
import { cardsRoute } from '../../modules/cards/routes/index.js';
import { configRoute } from '../../modules/config/routes/index.js';
import { horaryRoute } from '../../modules/horary/routes/index.js';
import { locationRoute } from '../../modules/location/routes/index.js';
import { physicalPermitRoute } from '../../modules/permissions/routes/index.js';

import { envs } from '../../config/index.js';
import { Router } from 'express';
import { swaggerConfig } from '../../docs/index.js';
import swaggerUi from 'swagger-ui-express';
import type { AppRoutes } from '../types/index.js';
import type { Express } from 'express';

export const appRoutes: AppRoutes = {
  accessPoints: accessPointsRoute(),
  auth: authRoute(),
  cards: cardsRoute(),
  config: configRoute(),
  horary: horaryRoute(),
  location: locationRoute(),
  physicalPermits: physicalPermitRoute(),
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

  router.use('/horary', appRoutes.horary);

  router.use('/permissions', appRoutes.physicalPermits);

  router.use('/config', appRoutes.config);

  app.use('/api', router);

  return router;
};
