import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from '../controllers/index.js';
import { Router } from 'express';
import { schemaValidator } from '../../shared/middlewares/index.js';
import { validateIdInRequestParams } from '../../shared/schemas/index.js';
import {
  validateRoleInRequestBody,
  validateRoleFiltersInQuery,
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

  return router;
};
