import { createLocationService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { LocationBodyRequest } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: LocationBodyRequest = req.body;

    await createLocationService(requestBody);

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.createLocation,
    });
  } catch (error) {
    next(error);
  }
};
