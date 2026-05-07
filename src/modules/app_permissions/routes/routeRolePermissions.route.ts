import {
  createAppPermission,
  deleteAppPermission,
  getAppPermissions,
} from '../controllers/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';
import {
  validateAppPermissionFiltersInQuery,
  validateAppPermissionInRequestBody,
} from '../schemas/index.js';
import { validateIdInRequestParams } from '../../shared/schemas/index.js';

export const appPermissionsRoute = (): Router => {
  const router = Router();

  router.get(
    '/',
    [schemaValidator(validateAppPermissionFiltersInQuery, 'query')],
    getAppPermissions,
  );

  router.post(
    '/',
    [schemaValidator(validateAppPermissionInRequestBody, 'body')],
    createAppPermission,
  );

  router.delete(
    '/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteAppPermission,
  );

  return router;
};
