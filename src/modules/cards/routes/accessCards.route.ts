import { Router } from 'express';

import {
  addNewCard,
  assignCard,
  blockCard,
  deleteCard,
  getCards,
  reactivateCard,
  reportLostCard,
  returnCard,
} from '../controllers/index.js';

import {
  checkPermissions,
  isAuth,
  schemaValidator,
} from '../../shared/middlewares/index.js';

import {
  validateAccessCardFiltersInQuery,
  validateAccessCardInRequestBody,
  validateAccessCardToAssignInRequestBody,
  validateIdInRequestParams,
} from '../schemas/index.js';

import { PERMISSIONS } from '../constants/index.js';

export const routeForAccessCards = (): Router => {
  const router = Router();

  router.get(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.getCards]),
      schemaValidator(validateAccessCardFiltersInQuery, 'query'),
    ],
    getCards,
  );

  router.post(
    '/',
    [
      isAuth,
      checkPermissions([PERMISSIONS.addNewCard]),
      schemaValidator(validateAccessCardInRequestBody, 'body'),
    ],
    addNewCard,
  );

  router.post(
    '/:id/assign',
    [
      isAuth,
      checkPermissions([PERMISSIONS.assignCard]),
      schemaValidator(validateAccessCardToAssignInRequestBody, 'body'),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    assignCard,
  );

  router.patch(
    '/:id/block',
    [
      isAuth,
      checkPermissions([PERMISSIONS.blockCard]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    blockCard,
  );

  router.patch(
    '/:id/lost',
    [
      isAuth,
      checkPermissions([PERMISSIONS.reportLostCard]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    reportLostCard,
  );

  router.patch(
    '/:id/return',
    [
      isAuth,
      checkPermissions([PERMISSIONS.returnCard]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    returnCard,
  );

  router.patch(
    '/:id/reactivate',
    [
      isAuth,
      checkPermissions([PERMISSIONS.reactivateCard]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    reactivateCard,
  );

  router.delete(
    '/:id/delete',
    [
      isAuth,
      checkPermissions([PERMISSIONS.deleteCard]),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    deleteCard,
  );

  return router;
};
