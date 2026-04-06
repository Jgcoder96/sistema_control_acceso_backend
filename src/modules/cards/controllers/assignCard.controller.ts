import { assignCardService } from '../services/index.js';
import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { assignCardBody } from '../types/index.js';
import type { Request, Response, NextFunction } from 'express';

export const assignCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cardID = req.params.id as string;

    const requestBody: assignCardBody = req.body;

    const { usuario_id } = requestBody;

    await assignCardService(cardID, usuario_id);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.assignCard,
    });
  } catch (error) {
    next(error);
  }
};
