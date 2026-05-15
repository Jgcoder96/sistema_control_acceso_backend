import { accessPointsRoute } from '../../modules/access_points/routes/index.js';
import { appPermissionsRoute } from '../../modules/app_permissions/routes/index.js';
import { authRoute } from '../../modules/auth/routes/index.js';
import { cardsRoute } from '../../modules/cards/routes/index.js';
import { configRoute } from '../../modules/config/routes/index.js';
import { locationRoute } from '../../modules/locations/routes/index.js';
import { physicalPermitRoute } from '../../modules/permissions/routes/index.js';
import { rolesRoute } from '../../modules/roles/routes/routeRoles.route.js';
import { schedulesRoute } from '../../modules/schedules/routes/index.js';

import { envs } from '../../config/index.js';
import { Router } from 'express';
import { swaggerConfig } from '../../docs/index.js';
import swaggerUi from 'swagger-ui-express';
import type { AppRoutes } from '../types/index.js';
import type { Express } from 'express';

export const appRoutes: AppRoutes = {
  accessPoints: accessPointsRoute(),
  appPermisions: appPermissionsRoute(),
  auth: authRoute(),
  cards: cardsRoute(),
  config: configRoute(),
  locations: locationRoute(),
  physicalPermits: physicalPermitRoute(),
  roles: rolesRoute(),
  schedules: schedulesRoute(),
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

  router.use('/firmware/cards', appRoutes.cards);

  router.use('/firmware/locations', appRoutes.locations);

  router.use('/firmware/access-points', appRoutes.accessPoints);

  router.use('/firmware/schedules', appRoutes.schedules);

  router.use('/firmware/permissions', appRoutes.physicalPermits);

  router.use('/app/roles', appRoutes.roles);

  router.use('/app/permissions', appRoutes.appPermisions);

  router.use('/config', appRoutes.config);

  app.use('/api', router);

  return router;
};
