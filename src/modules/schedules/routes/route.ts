import {
  createHoliday,
  createSchedule,
  deleteHoliday,
  deleteSchedule,
  getHolidays,
  getSchedules,
  updateHoliday,
  updateSchedule,
} from '../controllers/index.js';
import {
  validateHolidayInRequestBody,
  validateIdInRequestParams,
  validateScheduleInRequestBody,
  validateFiltersInQuery,
} from '../schemas/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';

export const schedulesRoute = (): Router => {
  const router = Router();

  router.get(
    '/',
    [schemaValidator(validateFiltersInQuery, 'query')],
    getSchedules,
  );

  router.post(
    '/',
    [schemaValidator(validateScheduleInRequestBody, 'body')],
    createSchedule,
  );

  router.put(
    '/:id',
    [
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateScheduleInRequestBody, 'body'),
    ],
    updateSchedule,
  );

  router.delete(
    '/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteSchedule,
  );

  router.get(
    '/holidays',
    [schemaValidator(validateFiltersInQuery, 'query')],
    getHolidays,
  );

  router.post(
    '/holidays',
    [schemaValidator(validateHolidayInRequestBody, 'body')],
    createHoliday,
  );

  router.put(
    '/holidays/:id',
    [
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateHolidayInRequestBody, 'body'),
    ],
    updateHoliday,
  );

  router.delete(
    '/holidays/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteHoliday,
  );

  return router;
};
