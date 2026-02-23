import { deviceConfigService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';
import type { RequestBodyDeviceConfig } from '../types/index.js';

export const deviceConfigController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: RequestBodyDeviceConfig = req.body;
    await deviceConfigService(requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.deviceConfig,
    });
  } catch (error) {
    next(error);
  }
};
