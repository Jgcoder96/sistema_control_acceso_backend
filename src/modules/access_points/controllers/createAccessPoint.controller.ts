import { createAccessPointService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { AccessPoint } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const createAccessPoint = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: AccessPoint = req.body;

    await createAccessPointService(requestBody);

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.createAccessPoint,
    });
  } catch (error) {
    next(error);
  }
};
