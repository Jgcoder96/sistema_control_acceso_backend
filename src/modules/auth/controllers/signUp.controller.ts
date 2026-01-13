import { signUpService } from '../services/signUp.service.js';
import type { Request, Response, NextFunction } from 'express';
import type { RequestBodySignUp } from '../types/RequestBodySignUp.type.js';
import type { RequestFile } from '../../../shared/types/RequestFile.type.js';

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
      message: 'Usuario registrado exitosamente.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
