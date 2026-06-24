import {
  assignPermissionsToRole,
  assignRolesToUser,
  createRole,
  deleteRole,
  getRoleByID,
  getRoles,
  getUserRolesByID,
  updateRole,
} from '../controllers/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';
import { validateIdInRequestParams } from '../../shared/schemas/index.js';
import {
  validatePermissionsInRequestBody,
  validateRoleFiltersInQuery,
  validateRoleInRequestBody,
  validateRolesInRequestBody,
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
    [
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validatePermissionsInRequestBody, 'body'),
    ],
    assignPermissionsToRole,
  );

  router.get(
    '/:id/permissions',
    [schemaValidator(validateIdInRequestParams, 'params')],
    getRoleByID,
  );

  router.post(
    '/:id/users',
    [
      schemaValidator(validateRolesInRequestBody, 'body'),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    assignRolesToUser,
  );

  router.get(
    '/:id/users',
    [schemaValidator(validateIdInRequestParams, 'params')],
    getUserRolesByID,
  );

  return router;
};
