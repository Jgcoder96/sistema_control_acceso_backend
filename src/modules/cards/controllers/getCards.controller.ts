import { getCardsService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { AccessCardFilters, AccessCardStatus } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allowedStatuses: AccessCardStatus[] = [
      'activable',
      'activa',
      'bloqueada',
      'perdida',
      'eliminada',
      'all',
    ];

    const queryStatus = req.query.status as string;

    const filters: AccessCardFilters = {
      status: allowedStatuses.includes(queryStatus as AccessCardStatus)
        ? (queryStatus as AccessCardStatus)
        : 'all',

      cedula: req.query.cedula as string,
      codigo: req.query.codigo as string,

      page: (req.query.page as string) || '1',
      limit: (req.query.limit as string) || '10',
    };

    const { data, metadata } = await getCardsService(filters);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.getCards,
      data,
      metadata,
    });
  } catch (error) {
    next(error);
  }
};
