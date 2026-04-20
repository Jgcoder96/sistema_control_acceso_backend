import {
  createPhysicalPermit,
  deletePhysicalPermit,
} from '../controllers/index.js';
import {
  validateIdInRequestParams,
  validatePhysicalPermitInRequestBody,
} from '../schemas/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';

export const physicalPermitRoute = (): Router => {
  const router = Router();

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
