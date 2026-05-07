import { getRolesService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { RoleFilters, RoleStatus } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allowedStatuses: RoleStatus[] = ['active', 'deleted', 'all'];

    const queryStatus = req.query.status as string;

    const filters: RoleFilters = {
      status: allowedStatuses.includes(queryStatus as RoleStatus)
        ? (queryStatus as RoleStatus)
        : 'all',

      search: req.query.search as string,
      page: (req.query.page as string) || '1',
      limit: (req.query.limit as string) || '10',
    };

    const roles = await getRolesService(filters);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getRoles,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};
