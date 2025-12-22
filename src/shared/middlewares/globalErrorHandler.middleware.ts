import type { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

import { parsePrismaError } from '../errors/parsePrismaError.error.js';

interface AppError extends Error {
  statusCode?: number;
}

export const globalErrorHandler = (
  err: AppError | Error | unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  // 1. Errores conocidos de Prisma
  if (err instanceof PrismaClientKnownRequestError) {
    const { statusCode, message } = parsePrismaError(err.code);

    res.status(statusCode).json({
      res: false,
      message,
    });

    return;
  }

  // 2. Errores genéricos de la aplicación
  const statusCode = (err as AppError).statusCode || 500;
  const message = (err as Error).message || 'Error interno del servidor';

  console.error(`[Error Log]: ${message}`);

  res.status(statusCode).json({
    res: false,
    message: statusCode === 500 ? 'Error interno del servidor' : message,
  });
};
