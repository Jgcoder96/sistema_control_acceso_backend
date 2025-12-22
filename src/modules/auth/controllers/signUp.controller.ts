import type { Request, Response, NextFunction } from 'express';

import { signUpService } from '../services/signUpService.service.js';
import type { UserToCreate } from '../types/UserToCreate.type.js';

export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: UserToCreate = req.body;

    const user = await signUpService(requestBody);

    res.status(201).json({
      res: true,
      message: 'Usuario registrado exitosamente.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
