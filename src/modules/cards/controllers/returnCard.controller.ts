import { RESPONSE_MESSAGES } from '../constants/index.js';
import { returnCardService } from '../services/index.js';
import type { Request, Response, NextFunction } from 'express';

export const returnCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const cardID = req.params.id as string;

  await returnCardService(cardID);

  try {
    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.returnCard,
    });
  } catch (error) {
    next(error);
  }
};
