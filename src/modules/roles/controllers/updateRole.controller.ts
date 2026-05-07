import { RESPONSE_MESSAGES } from '../constants/index.js';
import { updateRoleService } from '../services/index.js';
import type { RoleInBodyRequest } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;
    const requestBody: RoleInBodyRequest = req.body;

    await updateRoleService(requestParams, requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.updateRoles,
    });
  } catch (error) {
    next(error);
  }
};
