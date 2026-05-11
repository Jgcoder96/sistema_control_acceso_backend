import {
  assignPermissionsToRole,
  createRole,
  deleteRole,
  getRoleByID,
  getRoles,
  updateRole,
} from '../controllers/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';
import { validateIdInRequestParams } from '../../shared/schemas/index.js';
import {
  validateRoleInRequestBody,
  validateRoleFiltersInQuery,
  validatePermissionsInRequestBody,
} from '../schemas/index.js';

export const rolesRoute = (): Router => {
  const router = Router();

  router.get(
    '/',
    [schemaValidator(validateRoleFiltersInQuery, 'query')],
    getRoles,
  );

  router.post(
    '/',
    [schemaValidator(validateRoleInRequestBody, 'body')],
    createRole,
  );

  router.put(
    '/:id',
    [
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateRoleInRequestBody, 'body'),
    ],
    updateRole,
  );

  router.delete(
    '/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteRole,
  );

  router.post(
    '/:id/permissions',
    [schemaValidator(validatePermissionsInRequestBody, 'body')],
    assignPermissionsToRole,
  );

  router.get(
    '/:id/permissions',
    [schemaValidator(validateIdInRequestParams, 'params')],
    getRoleByID,
  );

  return router;
};
