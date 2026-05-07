import { createRoleService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { RoleInBodyRequest } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: RoleInBodyRequest = req.body;

    await createRoleService(requestBody);

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.createRole,
    });
  } catch (error) {
    next(error);
  }
};
