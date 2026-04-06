import { addNewCardService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { CardToCreate } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const addNewCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: CardToCreate = req.body;

    await addNewCardService(requestBody);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.addNewCard,
    });
  } catch (error) {
    next(error);
  }
};
