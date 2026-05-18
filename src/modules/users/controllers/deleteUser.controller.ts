import { deleteUserService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;

    await deleteUserService(requestParams);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.deleteUser,
    });
  } catch (error) {
    next(error);
  }
};
