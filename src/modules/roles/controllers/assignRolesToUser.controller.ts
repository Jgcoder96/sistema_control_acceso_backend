import { assignRolesToUserService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';
import type { RolesInRequestBody } from '../types/index.js';

export const assignRolesToUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;

    const requestBody: RolesInRequestBody = req.body;

    await assignRolesToUserService(requestParams, requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.assignRolesToUser,
    });
  } catch (error) {
    next(error);
  }
};
