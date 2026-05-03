import { deleteScheduleService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';

export const deleteSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;

    await deleteScheduleService(requestParams);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.deleteSchedule,
    });
  } catch (error) {
    next(error);
  }
};
