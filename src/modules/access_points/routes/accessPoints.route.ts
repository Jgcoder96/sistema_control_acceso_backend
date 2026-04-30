import {
  createAccessPoint,
  deleteAccessPoint,
  updateAccessPoint,
  getAccessPoints,
} from '../controllers/index.js';
import {
  validateAccessPointInBodyRequest,
  validateIdInRequestParams,
  validateLocationFiltersInQuery,
} from '../schemas/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';

export const accessPointsRoute = (): Router => {
  const router = Router();

  router.get(
    '/',
    [schemaValidator(validateLocationFiltersInQuery, 'query')],
    getAccessPoints,
  );

  router.post(
    '/',
    [schemaValidator(validateAccessPointInBodyRequest, 'body')],
    createAccessPoint,
  );

  router.put(
    '/:id',
    [
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateAccessPointInBodyRequest, 'body'),
    ],
    updateAccessPoint,
  );

  router.delete(
    '/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteAccessPoint,
  );

  return router;
};
