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
import {
  schemaValidator,
  isAuth,
  checkPermissions,
} from '../../shared/middlewares/index.js';
import { PERMISSIONS } from '../constants/index.js';

export const routesForSchedules = (): Router => {
  const router = Router();

  router.get(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getSchedules]),
      schemaValidator(validateFiltersInQuery, 'query'),
    ],
    getSchedules,
  );

  router.post(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.createSchedule]),
      schemaValidator(validateScheduleInRequestBody, 'body'),
    ],
    createSchedule,
  );

  router.put(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.updateSchedule]),
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateScheduleInRequestBody, 'body'),
    ],
    updateSchedule,
  );

  router.delete(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.updateSchedule]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    deleteSchedule,
  );

  router.get(
    '/holidays',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getHolidays]),
      schemaValidator(validateFiltersInQuery, 'query'),
    ],
    getHolidays,
  );

  router.post(
    '/holidays',
    [
      isAuth,
      checkPermissions([PERMISSIONS.createHoliday]),
      schemaValidator(validateHolidayInRequestBody, 'body'),
    ],
    createHoliday,
  );

  router.put(
    '/holidays/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.updateHoliday]),
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateHolidayInRequestBody, 'body'),
    ],
    updateHoliday,
  );

  router.delete(
    '/holidays/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.deleteHoliday]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    deleteHoliday,
  );

  return router;
};
