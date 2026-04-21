import { getLocationsService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { LocationFilters, LocationStatus } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const getLocations = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allowedStatuses: LocationStatus[] = ['active', 'deleted', 'all'];

    const queryStatus = req.query.status as string;

    const filters: LocationFilters = {
      status: allowedStatuses.includes(queryStatus as LocationStatus)
        ? (queryStatus as LocationStatus)
        : 'all',

      search: req.query.search as string,
      page: (req.query.page as string) || '1',
      limit: (req.query.limit as string) || '10',
    };

    const locations = await getLocationsService(filters);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getLocations,
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};
