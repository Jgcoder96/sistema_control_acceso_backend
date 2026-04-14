import { createHoraryService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { HoraryInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const createHorary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: HoraryInRequestBody = req.body;

    await createHoraryService(requestBody);

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.createhorary,
    });
  } catch (error) {
    next(error);
  }
};
