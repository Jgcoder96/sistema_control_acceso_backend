import { TokenNotFound, TokenInvalid, TokenExpired } from '../errors/index.js';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../../users/types/JWTPayload.type.js';
import type { Request, Response, NextFunction } from 'express';

interface RequestWithUser extends Request {
  user?: JWTPayload;
}

export const isAuth = (
  req: RequestWithUser,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) throw new TokenNotFound();

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JWTPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) throw new TokenExpired();

    if (error instanceof jwt.JsonWebTokenError) throw new TokenInvalid();

    throw error;
  }
};
