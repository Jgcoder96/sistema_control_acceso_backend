import { Router } from 'express';

import {
  createAppPermission,
  deleteAppPermission,
  getAppPermissions,
} from '../controllers/index.js';

import {
  checkPermissions,
  isAuth,
  schemaValidator,
} from '../../shared/middlewares/index.js';

import { validateIdInRequestParams } from '../../shared/schemas/index.js';

import {
  validateAppPermissionFiltersInQuery,
  validateAppPermissionInRequestBody,
} from '../schemas/index.js';

import { PERMISSIONS } from '../constants/index.js';

export const routeForAppPermissions = (): Router => {
  const router = Router();

  router.get(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getAppPermissions]),
      schemaValidator(validateAppPermissionFiltersInQuery, 'query'),
    ],
    getAppPermissions,
  );

  router.post(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.createAppPermission]),
      schemaValidator(validateAppPermissionInRequestBody, 'body'),
    ],
    createAppPermission,
  );

  router.delete(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.deleteAppPermission]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    deleteAppPermission,
  );

  return router;
};
