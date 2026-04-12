import { RESPONSE_MESSAGES } from '../constants/index.js';
import { updateAccessPointService } from '../services/index.js';
import type { AccessPointToUpdate } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const updateAccessPoint = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: AccessPointToUpdate = req.body;
    const requestParams = req.params.id as string;

    await updateAccessPointService(requestParams, requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.updateAccessPoint,
    });
  } catch (error) {
    next(error);
  }
};
