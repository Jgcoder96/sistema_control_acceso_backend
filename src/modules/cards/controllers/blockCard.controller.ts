import { blockCardService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';

export const blockCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cardID = req.params.id as string;

    await blockCardService(cardID);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.blockCard,
    });
  } catch (error) {
    next(error);
  }
};
