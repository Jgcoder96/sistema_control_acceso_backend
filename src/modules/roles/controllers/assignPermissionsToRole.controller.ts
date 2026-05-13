import { assignPermissionsToRoleService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { PermissionsInRequestBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const assignPermissionsToRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;

    const requestBody: PermissionsInRequestBody = req.body;

    await assignPermissionsToRoleService(requestParams, requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.assignPermissionsToRole,
    });
  } catch (error) {
    next(error);
  }
};
