import { RESPONSE_MESSAGES } from '../constants/index.js';
import { createUserService } from '../services/index.js';
import type { Request, Response, NextFunction } from 'express';
import type { UserToCreateInRequestBody } from '../types/index.js';
import type { RequestFile } from '../../shared/types/index.js';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestBody: UserToCreateInRequestBody = req.body;

    const requestFile: RequestFile | undefined = req.file;

    const user = await createUserService(requestBody, requestFile);

    res.status(201).json({
      success: true,
      message: RESPONSE_MESSAGES.createUser,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
