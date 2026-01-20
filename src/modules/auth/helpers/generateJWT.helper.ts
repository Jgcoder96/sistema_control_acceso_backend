import jwt from 'jsonwebtoken';
import { envs } from '../../../config/index.js';

export const generateJWT = async (payload: string): Promise<string> => {
  const token = jwt.sign({ id: payload }, envs.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  return token;
};
