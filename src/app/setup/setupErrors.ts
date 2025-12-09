import type { Express, Request, Response } from 'express';

export const setupError = (app: Express): void => {
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      res: false,
      message: 'El endpoint solicitado no existe.',
    });
  });
};
