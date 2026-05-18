import { RESPONSE_MESSAGES } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';
import type { UserToUpdateInRequestBody } from '../types/index.js';
import type { RequestFile } from '../../shared/types/index.js';
import { updateUserService } from '../services/index.js';

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestParams = req.params.id as string;

    const requestBody: UserToUpdateInRequestBody = req.body;

    const requestFile: RequestFile | undefined = req.file;

    await updateUserService(requestParams, requestBody, requestFile);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGES.updateUser,
    });
  } catch (error) {
    next(error);
  }
};
