import { Router } from 'express';

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

import {
  checkPermissions,
  isAuth,
  schemaValidator,
} from '../../shared/middlewares/index.js';

import { validateIdInRequestParams } from '../../shared/schemas/index.js';

import {
  validatePermissionsInRequestBody,
  validateRoleFiltersInQuery,
  validateRoleInRequestBody,
  validateRolesInRequestBody,
} from '../schemas/index.js';

import { PERMISSIONS } from '../constants/index.js';

export const routeForRoles = (): Router => {
  const router = Router();

  router.get(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getRoles]),
      schemaValidator(validateRoleFiltersInQuery, 'query'),
    ],
    getRoles,
  );

  router.post(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.createRole]),
      schemaValidator(validateRoleInRequestBody, 'body'),
    ],
    createRole,
  );

  router.put(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.updateRole]),
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validateRoleInRequestBody, 'body'),
    ],
    updateRole,
  );

  router.delete(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.deleteRole]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    deleteRole,
  );

  router.post(
    '/:id/permissions',
    [
      isAuth,
      checkPermissions([PERMISSIONS.assignPermissionsToRole]),
      schemaValidator(validateIdInRequestParams, 'params'),
      schemaValidator(validatePermissionsInRequestBody, 'body'),
    ],
    assignPermissionsToRole,
  );

  router.get(
    '/:id/permissions',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getRole]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    getRoleByID,
  );

  router.post(
    '/:id/users',
    [
      isAuth,
      checkPermissions([PERMISSIONS.assignRolesToUser]),
      schemaValidator(validateRolesInRequestBody, 'body'),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    assignRolesToUser,
  );

  router.get(
    '/:id/users',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getUserRoles]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    getUserRolesByID,
  );

  return router;
};
