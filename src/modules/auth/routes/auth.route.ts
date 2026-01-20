import { Action, signInSchema, signUpSchema } from '../schemas/index.js';
import {
  formDataValidator,
  schemaValidator,
} from '../../../shared/middlewares/index.js';
import { Router } from 'express';
import upload from '../../../config/multer.config.js';
import {
  changeLedStatusController,
  signUpController,
  signInController,
} from '../controllers/index.js';

export const authRoute = (): Router => {
  const router = Router();

  router.post(
    '/signup',
    [upload.single('foto'), formDataValidator(signUpSchema)],
    signUpController,
  );

  router.post('/signin', [schemaValidator(signInSchema)], signInController);

  router.post('/led', [schemaValidator(Action)], changeLedStatusController);

  return router;
};
