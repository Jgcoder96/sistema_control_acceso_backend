import { Action } from '../schemas/Action.schema.js';
import { changeLedStatusController } from '../controllers/changeLedStatus.controller.js';
import { formDataValidator } from '../../../shared/middlewares/formDataValidator.middleware.js';
import { Router } from 'express';
import { schemaValidator } from '../../../shared/middlewares/schemaValidator.middleware.js';
import { signUpController } from '../controllers/signUp.controller.js';
import { signUpSchema } from '../schemas/signUp.schema.js';
import upload from '../../../config/multer.config.js';

export const authRoute = (): Router => {
  const router = Router();
  router.post(
    '/register',
    [upload.single('foto'), formDataValidator(signUpSchema)],
    signUpController,
  );
  router.post('/led', [schemaValidator(Action)], changeLedStatusController);
  return router;
};
