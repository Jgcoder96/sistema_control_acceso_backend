import { RESPONSE_MESSAGES } from '../constants/index.js';
import { updateHoraryService } from '../services/updateHorary.service.js';
import type { HoraryInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const updateHorary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: HoraryInRequestBody = req.body;
    const requestParams = req.params.id as string;

    await updateHoraryService(requestParams, requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.updateHorary,
    });
  } catch (error) {
    next(error);
  }
};
