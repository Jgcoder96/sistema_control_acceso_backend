import { Router } from 'express';

import { registerUser } from '../controllers/register.controller.js';

export const authRoute = (): Router => {
  const router = Router();
  router.get('/login', registerUser);
  return router;
};
