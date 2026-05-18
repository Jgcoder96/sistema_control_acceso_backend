import { loginService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { LoginInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: LoginInRequestBody = req.body;

    const user = await loginService(requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.login,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
