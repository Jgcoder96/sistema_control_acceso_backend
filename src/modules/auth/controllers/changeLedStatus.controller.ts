import type { Request, Response, NextFunction } from 'express';

import { publishMessage } from '../../../MQTT/publisher/publishmessage.publish.js';

export const changeLedStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { accion } = req.body;
    await publishMessage('casa/luz', accion);
    res
      .status(200)
      .json({ res: true, message: 'Accion enviada correctamente' });
  } catch (error) {
    next(error);
  }
};
