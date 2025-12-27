import { Router } from 'express';
import { changeLedStatusController } from '../controllers/changeLedStatus.controller.js';
import { registerUserSchema } from '../schemas/registerUser.schema.js';
import { schemaValidator } from '../../../shared/middlewares/schemaValidator.middleware.js';
import { signUpController } from '../controllers/signUp.controller.js';
import { Action } from '../schemas/Action.schema.js';

export const authRoute = (): Router => {
  const router = Router();
  router.post(
    '/register',
    [schemaValidator(registerUserSchema)],
    signUpController,
  );
  router.post('/led', [schemaValidator(Action)], changeLedStatusController);
  return router;
};
