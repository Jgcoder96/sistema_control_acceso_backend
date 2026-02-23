import { configAllDevicesService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';
import type { RequestBodyConfigAllDevices } from '../types/index.js';

export const configAllDevicesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: RequestBodyConfigAllDevices = req.body;
    await configAllDevicesService(requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.configAllDevices,
    });
  } catch (error) {
    next(error);
  }
};
