import { getAccessPointsService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { AccessPointFilters, Status } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const getAccessPoints = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allowedStatuses: Status[] = ['active', 'deleted', 'all'];

    const queryStatus = req.query.status as string;

    const filters: AccessPointFilters = {
      status: allowedStatuses.includes(queryStatus as Status)
        ? (queryStatus as Status)
        : 'all',
      limit: (req.query.limit as string) || '10',
      locationId: req.query.location as string,
      page: (req.query.page as string) || '1',
      search: req.query.search as string,
    };

    const accessPoints = await getAccessPointsService(filters);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getAccessPoints,
      data: accessPoints,
    });
  } catch (error) {
    next(error);
  }
};
