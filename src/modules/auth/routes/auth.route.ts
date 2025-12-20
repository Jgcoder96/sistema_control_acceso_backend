import { Router } from 'express';

import { registerUser } from '../controllers/register.controller.js';
import { registerUserSchema } from '../schemas/registerUser.schemas.js';
import { schemaValidator } from '../../../shared/middlewares/schemaValidator.middleware.js';

export const authRoute = (): Router => {
  const router = Router();
  router.post('/register', [schemaValidator(registerUserSchema)], registerUser);
  return router;
};
