import { RESPONSE_MESSAGES } from '../constants/index.js';
import { updateLocationService } from '../services/index.js';
import type { LocationBodyRequest } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;
    const requestBody: LocationBodyRequest = req.body;

    await updateLocationService(requestParams, requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.updateLocation,
    });
  } catch (error) {
    next(error);
  }
};
