import { deleteHolidayService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';

export const deleteHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;

    await deleteHolidayService(requestParams);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.deleteHoliday,
    });
  } catch (error) {
    next(error);
  }
};
