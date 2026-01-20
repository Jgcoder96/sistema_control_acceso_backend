import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '../../config/logger.config.js';
import { parsePrismaError } from '../errors/parsePrismaError.error.js';
import { RecordNotFound, InvalidPassword } from '../errors/index.js';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const meta = { path: req.originalUrl, method: req.method };

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const parsedError = parsePrismaError(err.code);
    if (parsedError.statusCode >= 500) {
      logger.error(`Prisma Error`, {
        ...meta,
        code: err.code,
      });
    } else {
      logger.warn(`Prisma Error`, { ...meta, code: err.code });
    }

    res
      .status(parsedError.statusCode)
      .json({ success: false, message: parsedError.message });

    return;
  }

  if (err instanceof RecordNotFound) {
    logger.warn('Registro no encontrado', { ...meta });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  } else if (err instanceof InvalidPassword) {
    logger.warn('Contraseña inválida', { ...meta });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  logger.error('Error interno del servidor', { ...meta });

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor.',
  });
};
