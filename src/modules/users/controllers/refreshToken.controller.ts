import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { RefreshTokenInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';
import { refreshTokenService } from '../services/index.js';

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: RefreshTokenInRequestBody = req.body;

    const data = await refreshTokenService(requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.refreshToken,
      data,
    });
  } catch (error) {
    next(error);
  }
};
