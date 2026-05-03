import { RESPONSE_MESSAGES } from '../constants/index.js';
import { updateScheduleService } from '../services/updateSchedule.service.js';
import type { ScheduleInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const updateSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: ScheduleInRequestBody = req.body;
    const requestParams = req.params.id as string;

    await updateScheduleService(requestParams, requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.updateSchedule,
    });
  } catch (error) {
    next(error);
  }
};
