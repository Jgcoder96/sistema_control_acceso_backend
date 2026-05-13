import { getUserRolesByIDService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';

export const getUserRolesByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;

    const user = await getUserRolesByIDService(requestParams);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getUserRoles,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
