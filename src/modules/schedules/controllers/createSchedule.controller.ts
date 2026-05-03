import { createScheduleService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { ScheduleInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: ScheduleInRequestBody = req.body;

    await createScheduleService(requestBody);

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.createSchedule,
    });
  } catch (error) {
    next(error);
  }
};
