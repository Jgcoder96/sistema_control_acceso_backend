import type { Request, Response } from 'express';

export const registerUser = (_req: Request, res: Response): void => {
  res.status(201).json({ message: 'Usuario Registrado Correctamente' });
};
