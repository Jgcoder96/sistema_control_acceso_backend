import { createHolidayService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { HolidayInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const createHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: HolidayInRequestBody = req.body;

    await createHolidayService(requestBody);

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.createHoliday,
    });
  } catch (error) {
    next(error);
  }
};
