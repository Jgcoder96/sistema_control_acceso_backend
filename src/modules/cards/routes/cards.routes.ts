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
import { schemaValidator } from '../../shared/middlewares/index.js';
import {
  validateAccessCardInRequestBody,
  validateAccessCardToAssignInRequestBody,
  validateIdInRequestParams,
  validateAccessCardFiltersInQuery,
} from '../schemas/index.js';

export const cardsRoute = (): Router => {
  const router = Router();

  router.get(
    '/',
    [schemaValidator(validateAccessCardFiltersInQuery, 'query')],
    getCards,
  );

  router.post(
    '/',
    [schemaValidator(validateAccessCardInRequestBody, 'body')],
    addNewCard,
  );

  router.post(
    '/:id/assign',
    [
      schemaValidator(validateAccessCardToAssignInRequestBody, 'body'),
      schemaValidator(validateIdInRequestParams, 'params'),
    ],
    assignCard,
  );

  router.patch(
    '/:id/block',
    [schemaValidator(validateIdInRequestParams, 'params')],
    blockCard,
  );

  router.patch(
    '/:id/lost',
    [schemaValidator(validateIdInRequestParams, 'params')],
    reportLostCard,
  );

  router.patch(
    '/:id/return',
    [schemaValidator(validateIdInRequestParams, 'params')],
    returnCard,
  );

  router.patch(
    '/:id/reactivate',
    [schemaValidator(validateIdInRequestParams, 'params')],
    reactivateCard,
  );

  router.delete(
    '/:id/delete',
    [schemaValidator(validateIdInRequestParams, 'params')],
    deleteCard,
  );

  return router;
};
