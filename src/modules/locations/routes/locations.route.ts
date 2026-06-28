import { Router } from 'express';

import {
  createLocation,
  deleteLocation,
  getLocations,
  updateLocation,
} from '../controllers/index.js';

import {
  checkPermissions,
  isAuth,
  schemaValidator,
} from '../../shared/middlewares/index.js';

import {
  validateIdInRequestParams,
  validateLocationFiltersInQuery,
  validateLocationInRequestBody,
} from '../schemas/index.js';

import { PERMISSIONS } from '../constants/index.js';

export const routeForLocations = (): Router => {
  const router = Router();

  router.get(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getLocations]),
      schemaValidator(validateLocationFiltersInQuery, 'query'),
    ],
    getLocations,
  );

  router.post(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.createLocation]),
      schemaValidator(validateLocationInRequestBody, 'body'),
    ],
    createLocation,
  );

  router.put(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.updateLocation]),
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateLocationInRequestBody, 'body'),
    ],
    updateLocation,
  );

  router.delete(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.deleteLocation]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    deleteLocation,
  );

  return router;
};
