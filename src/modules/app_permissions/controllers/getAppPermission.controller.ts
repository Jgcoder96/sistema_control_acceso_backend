import { getAppPermissionsService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { AppPermissionFilters, Status } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const getAppPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allowedStatuses: Status[] = ['active', 'deleted', 'all'];

    const queryStatus = req.query.status as string;

    const filters: AppPermissionFilters = {
      status: allowedStatuses.includes(queryStatus as Status)
        ? (queryStatus as Status)
        : 'all',

      search: req.query.search as string,
      page: (req.query.page as string) || '1',
      limit: (req.query.limit as string) || '10',
    };

    const roles = await getAppPermissionsService(filters);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getAppPermissions,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};
