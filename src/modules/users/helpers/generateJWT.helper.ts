import jwt from 'jsonwebtoken';
import { envs } from '../../../config/index.js';
import type { JWTPayload } from '../types/index.js';
import { SessionExpired, InvalidToken } from '../errors/index.js';

export const generateAccessToken = async (
  payload: JWTPayload,
): Promise<string> => {
  return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = async (id: string): Promise<string> => {
  return jwt.sign({ id }, envs.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, envs.JWT_REFRESH_SECRET) as { id: string };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new SessionExpired();
    }

    throw new InvalidToken();
  }
};
