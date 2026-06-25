import { getAccessLogs } from '../controllers/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';
import { validateAccessLogsFiltersInQuery } from '../schemas/index.js';

export const logsRoutes = (): Router => {
  const router = Router();

  router.get(
    '/',
    [schemaValidator(validateAccessLogsFiltersInQuery, 'query')],
    getAccessLogs,
  );

  return router;
};
