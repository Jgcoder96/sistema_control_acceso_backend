import { Router } from 'express';

import {
  createAccessPoint,
  deleteAccessPoint,
  getAccessPoints,
  updateAccessPoint,
} from '../controllers/index.js';

import {
  checkPermissions,
  isAuth,
  schemaValidator,
} from '../../shared/middlewares/index.js';

import {
  validateAccesspointFiltersInQuery,
  validateAccessPointInBodyRequest,
  validateIdInRequestParams,
} from '../schemas/index.js';

import { PERMISSIONS } from '../constants/index.js';

export const routeForAccessPoints = (): Router => {
  const router = Router();

  router.get(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getAccessPoints]),
      schemaValidator(validateAccesspointFiltersInQuery, 'query'),
    ],
    getAccessPoints,
  );

  router.post(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.createAccessPoint]),
      schemaValidator(validateAccessPointInBodyRequest, 'body'),
    ],
    createAccessPoint,
  );

  router.put(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.updateAccessPoint]),
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateAccessPointInBodyRequest, 'body'),
    ],
    updateAccessPoint,
  );

  router.delete(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.deleteAccessPoint]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    deleteAccessPoint,
  );

  return router;
};
