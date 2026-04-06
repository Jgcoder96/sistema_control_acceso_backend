import { logger } from '../../../config/logger.config.js';
import { parsePrismaError } from '../errors/index.js';
import { Prisma } from '@prisma/client';
import { publishDataError } from '../../../mqtt/errors/index.js';
import { AppError } from '../errors/index.js';
import type { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const meta = { path: req.originalUrl, method: req.method };

  let statusCode = 500;
  let message = 'Error interno del servidor.';
  //let isOperational = false;

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
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    //isOperational = true;
    logger.warn(`${err.constructor.name}: ${message}`, { ...meta });
  } else if (err instanceof publishDataError) {
    logger.warn('Error al publicar mensaje MQTT', { ...meta });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  } else {
    logger.error('Unhandled Exception', {
      ...meta,
      error: err.message,
      stack: err.stack,
    });
  }

  //logger.error('Error interno del servidor', { ...meta });

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
