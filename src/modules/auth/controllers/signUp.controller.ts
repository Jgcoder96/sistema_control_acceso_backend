import { signUpService } from '../services/index.js';
import type { Request, Response, NextFunction } from 'express';
import type { RequestBodySignUp } from '../types/index.js';
import type { RequestFile } from '../../shared/types/index.js';

export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: RequestBodySignUp = req.body;

    const requestFile: RequestFile | undefined = req.file;

    const user = await signUpService(requestBody, requestFile);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
