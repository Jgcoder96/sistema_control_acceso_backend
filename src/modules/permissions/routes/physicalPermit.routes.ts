import {
  createPhysicalPermit,
  deletePhysicalPermit,
  getPhysicalPermits,
} from '../controllers/index.js';
import {
  validateIdInRequestParams,
  validatePhysicalPermitInRequestBody,
  validatePhysicalPermitFiltersInQuery,
} from '../schemas/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';

export const physicalPermitRoute = (): Router => {
  const router = Router();

  router.get(
    '/',
    [schemaValidator(validatePhysicalPermitFiltersInQuery, 'query')],
    getPhysicalPermits,
  );

  router.post(
    '/',
    [schemaValidator(validatePhysicalPermitInRequestBody, 'body')],
    createPhysicalPermit,
  );

  router.delete(
    '/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deletePhysicalPermit,
  );

  return router;
};
