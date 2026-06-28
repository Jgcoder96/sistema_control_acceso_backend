import { Router } from 'express';

import { getAccessLogs } from '../controllers/index.js';

import { schemaValidator } from '../../shared/middlewares/index.js';

import { validateAccessLogsFiltersInQuery } from '../schemas/index.js';

export const routeForLogs = (): Router => {
  const router = Router();

  router.get(
    '/',
    [schemaValidator(validateAccessLogsFiltersInQuery, 'query')],
    getAccessLogs,
  );

  return router;
};
