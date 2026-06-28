import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

import { envs } from '../../config/index.js';

import { swaggerConfig } from '../../docs/index.js';
import type { AppRoutes } from '../types/index.js';

import { routeForAccessCards } from '../../modules/cards/routes/index.js';
import { routeForAccessPoints } from '../../modules/access_points/routes/index.js';
import { routeForAppPermissions } from '../../modules/app_permissions/routes/index.js';
import { routeForLocations } from '../../modules/locations/routes/index.js';
import { routeForLogs } from '../../modules/logs/routes/index.js';
import { routeForPhysicalPermits } from '../../modules/permissions/routes/index.js';
import { routeForRoles } from '../../modules/roles/routes/roles.route.js';
import { routeForUsers } from '../../modules/users/routes/index.js';
import { routesForSchedules } from '../../modules/schedules/routes/index.js';

export const appRoutes: AppRoutes = {
  accessPoints: routeForAccessPoints(),
  appPermisions: routeForAppPermissions(),
  cards: routeForAccessCards(),
  locations: routeForLocations(),
  logs: routeForLogs(),
  physicalPermits: routeForPhysicalPermits(),
  roles: routeForRoles(),
  schedules: routesForSchedules(),
  users: routeForUsers(),
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

  router.use('/app/permissions', appRoutes.appPermisions);
  router.use('/app/roles', appRoutes.roles);
  router.use('/firmware/access-points', appRoutes.accessPoints);
  router.use('/firmware/cards', appRoutes.cards);
  router.use('/firmware/locations', appRoutes.locations);
  router.use('/firmware/logs', appRoutes.logs);
  router.use('/firmware/permissions', appRoutes.physicalPermits);
  router.use('/firmware/schedules', appRoutes.schedules);
  router.use('/users', appRoutes.users);

  app.use('/api', router);

  return router;
};
