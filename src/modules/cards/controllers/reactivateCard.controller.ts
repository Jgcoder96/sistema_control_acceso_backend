import { reactivateCardService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';

export const reactivateCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cardID = req.params.id as string;

    await reactivateCardService(cardID);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.reactivateCard,
    });
  } catch (error) {
    next(error);
  }
};
