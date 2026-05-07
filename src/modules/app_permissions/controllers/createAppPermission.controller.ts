import { createAppPermissionService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { AppPermissionInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const createAppPermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: AppPermissionInRequestBody = req.body;

    await createAppPermissionService(requestBody);

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.createAppPermission,
    });
  } catch (error) {
    next(error);
  }
};
