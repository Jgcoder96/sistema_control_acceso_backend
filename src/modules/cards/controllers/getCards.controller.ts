import { type Request, type Response } from 'express';

export const getCards = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'Tarjetas obtenidas exitosamente',
    });
  } catch (error) {
    console.log(error);
  }
};
