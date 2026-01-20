import { signInService } from '../services/index.js';
import type { Request, Response, NextFunction } from 'express';
import type { RequestBodySignIn } from '../types/index.js';

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: RequestBodySignIn = req.body;

    const user = await signInService(requestBody);

    res.status(200).json({
      success: true,
      message: 'Login exitoso.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
