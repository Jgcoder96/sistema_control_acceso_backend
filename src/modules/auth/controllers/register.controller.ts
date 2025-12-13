import type { Request, Response } from 'express';

import { publishMessage } from '../../../MQTT/publisher/publishmessage.publish.js';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { accion } = req.body;

    if (typeof accion !== 'string') {
      res.status(400).json({ error: 'La acción debe ser un texto' });
    }

    await publishMessage('casa/luz', accion);

    res.json({ success: true, message: `Comando enviado: ${accion}` });
  } catch (error) {
    console.log(error);
  }
};
