import { createPhysicalPermitService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { PhysicalPermitInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const createPhysicalPermit = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: PhysicalPermitInRequestBody = req.body;

    await createPhysicalPermitService(requestBody);

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.createPhysicalPermit,
    });
  } catch (error) {
    next(error);
  }
};
