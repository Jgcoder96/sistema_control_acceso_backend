import {
  createHorary,
  deleteHorary,
  updateHorary,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from '../controllers/index.js';
import {
  validateHoraryInRequestBody,
  validateIdInRequestParams,
  validateHolidayInRequestBody,
} from '../schemas/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';

export const horaryRoute = (): Router => {
  const router = Router();

  router.post(
    '/',
    [schemaValidator(validateHoraryInRequestBody, 'body')],
    createHorary,
  );

  router.put(
    '/:id',
    [
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateHoraryInRequestBody, 'body'),
    ],
    updateHorary,
  );

  router.delete(
    '/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteHorary,
  );

  router.post(
    '/holiday',
    [schemaValidator(validateHolidayInRequestBody, 'body')],
    createHoliday,
  );

  router.put(
    '/holiday/:id',
    [
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateHolidayInRequestBody, 'body'),
    ],
    updateHoliday,
  );

  router.delete(
    '/holiday/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteHoliday,
  );

  return router;
};
