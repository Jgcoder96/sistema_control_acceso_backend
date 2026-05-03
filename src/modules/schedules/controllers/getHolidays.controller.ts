import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { HolidayFilters, HolidayStatus } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';
import { getHolidaysService } from '../services/index.js';

export const getHolidays = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allowedStatuses: HolidayStatus[] = ['active', 'deleted', 'all'];

    const queryStatus = req.query.status as string;

    const filters: HolidayFilters = {
      status: allowedStatuses.includes(queryStatus as HolidayStatus)
        ? (queryStatus as HolidayStatus)
        : 'all',
      limit: (req.query.limit as string) || '10',
      page: (req.query.page as string) || '1',
      search: req.query.search as string,
    };

    const holidays = await getHolidaysService(filters);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getHolidays,
      data: holidays,
    });
  } catch (error) {
    next(error);
  }
};
