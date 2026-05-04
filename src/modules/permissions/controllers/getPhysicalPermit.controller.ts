import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { PhysicalPermitFilters, FilterStatus } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';
import { getPhysicalPermitsService } from '../services/index.js';

export const getPhysicalPermits = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allowedStatuses: FilterStatus[] = ['active', 'deleted', 'all'];

    const queryStatus = req.query.status as string;

    const filters: PhysicalPermitFilters = {
      status: allowedStatuses.includes(queryStatus as FilterStatus)
        ? (queryStatus as FilterStatus)
        : 'all',

      cedula: req.query.cedula as string,
      puntoAcceso: req.query.puntoAcceso as string,
      ubicacion: req.query.ubicacion as string,

      page: (req.query.page as string) || '1',
      limit: (req.query.limit as string) || '10',
    };

    const physicalPermits = await getPhysicalPermitsService(filters);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getPhysicalPermits,
      data: physicalPermits,
    });
  } catch (error) {
    next(error);
  }
};
