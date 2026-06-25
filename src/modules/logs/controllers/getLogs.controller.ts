import { getAccessLogsService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { AccessLogsFilters } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const getAccessLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters: AccessLogsFilters = {
      cedula: req.query.cedula as string,
      puntoDeAccesoId: req.query.puntoDeAccesoId as string,
      tarjeta: req.query.tarjeta as string,
      ubicacionId: req.query.ubicacionId as string,

      page: (req.query.page as string) || '1',
      limit: (req.query.limit as string) || '10',
    };

    const { data, metadata } = await getAccessLogsService(filters);

    console.log('dqwdqw');

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.getLogs,
      data,
      metadata,
    });
  } catch (error) {
    next(error);
  }
};
