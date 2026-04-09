import { Router } from 'express';
import {
  createLocation,
  deleteLocation,
  updateLocation,
} from '../controllers/index.js';
import {
  validateIdInRequestParams,
  validateNameInRequestBody,
} from '../schemas/index.js';
import { schemaValidator } from '../../shared/middlewares/index.js';

export const locationRoute = (): Router => {
  const router = Router();

  router.post(
    '/',
    [schemaValidator(validateNameInRequestBody, 'body')],
    createLocation,
  );

  router.put(
    '/:id',
    [
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateNameInRequestBody, 'body'),
    ],
    updateLocation,
  );

  router.delete(
    '/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteLocation,
  );

  return router;
};
