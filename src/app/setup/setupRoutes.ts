import { accessPointsRoute } from '../../modules/access_points/routes/index.js';
import { authRoute } from '../../modules/auth/routes/index.js';
import { cardsRoute } from '../../modules/cards/routes/index.js';
import { configRoute } from '../../modules/config/routes/index.js';
import { schedulesRoute } from '../../modules/schedules/routes/index.js';
import { locationRoute } from '../../modules/locations/routes/index.js';
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
  horary: schedulesRoute(),
  location: locationRoute(),
  physicalPermits: physicalPermitRoute(),
};

export const setupRoutes = (app: Express): Router => {
  const router = Router();

  if (envs.NODE_ENV !== 'production') {
    app.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerConfig, {
        customSiteTitle: 'Documentación',

        customfavIcon:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Logo_Universidad_Central_de_Venezuela.svg/500px-Logo_Universidad_Central_de_Venezuela.svg.png',

        swaggerOptions: {
          docExpansion: 'none',
          filter: true,
          persistAuthorization: true,
          displayRequestDuration: true,
          deepLinking: true,
          operationsSorter: 'alpha',
        },
      }),
    );
  }

  router.use('/auth', appRoutes.auth);

  router.use('/cards', appRoutes.cards);

  router.use('/locations', appRoutes.location);

  router.use('/access-points', appRoutes.accessPoints);

  router.use('/schedules', appRoutes.horary);

  router.use('/permissions', appRoutes.physicalPermits);

  router.use('/config', appRoutes.config);

  app.use('/api', router);

  return router;
};
