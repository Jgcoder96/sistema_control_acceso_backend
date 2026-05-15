import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { ScheduleFilters, ScheduleStatus } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';
import { getSchedulesService } from '../services/index.js';

export const getSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allowedStatuses: ScheduleStatus[] = ['active', 'deleted', 'all'];

    const queryStatus = req.query.status as string;

    const filters: ScheduleFilters = {
      status: allowedStatuses.includes(queryStatus as ScheduleStatus)
        ? (queryStatus as ScheduleStatus)
        : 'all',
      limit: (req.query.limit as string) || '10',
      page: (req.query.page as string) || '1',
      search: req.query.search as string,
    };

    const { data, metadata } = await getSchedulesService(filters);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getSchedules,
      data,
      metadata,
    });
  } catch (error) {
    next(error);
  }
};
