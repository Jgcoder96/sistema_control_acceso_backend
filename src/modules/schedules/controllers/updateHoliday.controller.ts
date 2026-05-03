import { RESPONSE_MESSAGES } from '../constants/index.js';
import { updateHolidayService } from '../services/index.js';
import type { HolidayInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const updateHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: HolidayInRequestBody = req.body;
    const requestParams = req.params.id as string;

    await updateHolidayService(requestParams, requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.updateHoliday,
    });
  } catch (error) {
    next(error);
  }
};
