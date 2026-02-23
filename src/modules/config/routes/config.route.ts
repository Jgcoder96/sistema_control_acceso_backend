import {
  configAllDevicesController,
  deviceConfigController,
} from '../controllers/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';
import {
  configAllDevicesSchema,
  deviceConfigSchema,
} from '../schemas/index.js';

export const configRoute = (): Router => {
  const router = Router();

  router.post(
    '/device',
    [schemaValidator(deviceConfigSchema)],
    deviceConfigController,
  );

  router.post(
    '/all-devices',
    [schemaValidator(configAllDevicesSchema)],
    configAllDevicesController,
  );

  return router;
};
