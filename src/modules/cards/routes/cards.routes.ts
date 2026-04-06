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
  addCardsSchema,
  assignCardBodySchema,
  validateIdCardParamsSchema,
} from '../schemas/index.js';

export const cardsRoute = (): Router => {
  const router = Router();

  router.get('/', getCards);

  router.post('/', [schemaValidator(addCardsSchema, 'body')], addNewCard);

  router.post(
    '/:id/assign',
    [
      schemaValidator(assignCardBodySchema, 'body'),
      schemaValidator(validateIdCardParamsSchema, 'params'),
    ],
    assignCard,
  );

  router.patch(
    '/:id/block',
    [schemaValidator(validateIdCardParamsSchema, 'params')],
    blockCard,
  );

  router.patch(
    '/:id/lost',
    [schemaValidator(validateIdCardParamsSchema, 'params')],
    reportLostCard,
  );

  router.patch(
    '/:id/return',
    [schemaValidator(validateIdCardParamsSchema, 'params')],
    returnCard,
  );

  router.patch(
    '/:id/reactivate',
    [schemaValidator(validateIdCardParamsSchema, 'params')],
    reactivateCard,
  );

  router.delete(
    '/:id/delete',
    [schemaValidator(validateIdCardParamsSchema, 'params')],
    deleteCard,
  );

  return router;
};
