import {
  createAccessPoint,
  deleteAccessPoint,
  updateAccessPoint,
} from '../controllers/index.js';
import {
  validateAccessPointForCreateInBodyRequest,
  validateAccessPointForUpdateInBodyRequest,
  validateIdInRequestParams,
} from '../schemas/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';

export const accessPointsRoute = (): Router => {
  const router = Router();

  router.post(
    '/',
    [schemaValidator(validateAccessPointForCreateInBodyRequest, 'body')],
    createAccessPoint,
  );

  router.put(
    '/:id',
    [
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateAccessPointForUpdateInBodyRequest, 'body'),
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
