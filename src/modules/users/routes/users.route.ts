import {
  validateLoginInRequestBody,
  validateUserForCreateInRequestBody,
  validateUserForUpdateInRequestBody,
  validateUsersFiltersInQuery,
  validateRefreshRequestBody,
} from '../schemas/index.js';
import {
  formDataValidator,
  schemaValidator,
  isAuth,
  checkPermissions,
} from '../../shared/middlewares/index.js';
import { Router } from 'express';
import upload from '../../../config/multer.config.js';
import {
  createUser,
  deleteUser,
  getUsers,
  login,
  refreshToken,
  updateUser,
} from '../controllers/index.js';
import { validateIdInRequestParams } from '../../shared/schemas/index.js';
import { PERMISSIONS } from '../constants/index.js';

export const routeForUsers = (): Router => {
  const router = Router();

  router.post(
    '/login',
    [schemaValidator(validateLoginInRequestBody, 'body')],
    login,
  );

  router.post(
    '/refresh-token',
    [schemaValidator(validateRefreshRequestBody, 'body')],
    refreshToken,
  );

  router.get(
    '/',
    isAuth,
    checkPermissions([PERMISSIONS.getUsers]),
    [schemaValidator(validateUsersFiltersInQuery, 'query')],
    getUsers,
  );

  router.post(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.createUser]),
      upload.single('foto'),
      formDataValidator(validateUserForCreateInRequestBody),
    ],
    createUser,
  );

  router.put(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.updateUser]),
      upload.single('foto'),
      schemaValidator(validateIdInRequestParams, 'params'),
      formDataValidator(validateUserForUpdateInRequestBody),
    ],
    updateUser,
  );

  router.delete(
    '/:id',
    [
      isAuth,
      checkPermissions([PERMISSIONS.deleteUser]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    deleteUser,
  );

  return router;
};
