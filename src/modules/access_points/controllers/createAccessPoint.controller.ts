import { createAccessPointService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { AccessPointToCreate } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const createAccessPoint = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: AccessPointToCreate = req.body;

    await createAccessPointService(requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.createAccessPoint,
    });
  } catch (error) {
    next(error);
  }
};
