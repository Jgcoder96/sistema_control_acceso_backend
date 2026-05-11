import { getRoleByIDService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';

export const getRoleByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;

    const role = await getRoleByIDService(requestParams);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getRole,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};
