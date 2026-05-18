import {
  validateLoginInRequestBody,
  validateUserForCreateInRequestBody,
  validateUserForUpdateInRequestBody,
  validateUsersFiltersInQuery,
} from '../schemas/index.js';
import {
  formDataValidator,
  schemaValidator,
} from '../../shared/middlewares/index.js';
import { Router } from 'express';
import upload from '../../../config/multer.config.js';
import {
  createUser,
  deleteUser,
  getUsers,
  login,
  updateUser,
} from '../controllers/index.js';
import { validateIdInRequestParams } from '../../shared/schemas/index.js';

export const authRoute = (): Router => {
  const router = Router();

  router.post(
    '/login',
    [schemaValidator(validateLoginInRequestBody, 'body')],
    login,
  );

  router.get(
    '/',
    [schemaValidator(validateUsersFiltersInQuery, 'query')],
    getUsers,
  );

  router.post(
    '/',
    [
      upload.single('foto'),
      formDataValidator(validateUserForCreateInRequestBody),
    ],
    createUser,
  );

  router.put(
    '/:id',
    [
      upload.single('foto'),
      schemaValidator(validateIdInRequestParams, 'params'),
      formDataValidator(validateUserForUpdateInRequestBody),
    ],
    updateUser,
  );

  router.delete(
    '/:id',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteUser,
  );

  return router;
};
