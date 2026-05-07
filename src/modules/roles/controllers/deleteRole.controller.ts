import { deleteRoleService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';

export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;

    await deleteRoleService(requestParams);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.deleteRole,
    });
  } catch (error) {
    next(error);
  }
};
