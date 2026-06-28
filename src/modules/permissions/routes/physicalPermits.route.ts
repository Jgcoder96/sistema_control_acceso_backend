import { Router } from 'express';

import {
  createPhysicalPermit,
  deletePhysicalPermit,
  getPhysicalPermits,
} from '../controllers/index.js';

import {
  checkPermissions,
  isAuth,
  schemaValidator,
} from '../../shared/middlewares/index.js';

import {
  validateIdInRequestParams,
  validatePhysicalPermitFiltersInQuery,
  validatePhysicalPermitInRequestBody,
} from '../schemas/index.js';

import { PERMISSIONS } from '../constants/index.js';

export const routeForPhysicalPermits = (): Router => {
  const router = Router();

  router.get(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getPhysicalPermits]),
      schemaValidator(validatePhysicalPermitFiltersInQuery, 'query'),
    ],
    getPhysicalPermits,
  );

  router.post(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.createPhysicalPermit]),
      schemaValidator(validatePhysicalPermitInRequestBody, 'body'),
    ],
    createPhysicalPermit,
  );

  router.delete(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.deletePhysicalPermit]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    deletePhysicalPermit,
  );

  return router;
};
