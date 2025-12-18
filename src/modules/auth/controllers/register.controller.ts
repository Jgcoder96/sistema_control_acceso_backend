import type { Request, Response } from 'express';

import { publishMessage } from '../../../MQTT/publisher/publishmessage.publish.js';
import { getUser } from '../models/getUser.model.js';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { accion } = req.body;

    if (typeof accion !== 'string') {
      res.status(400).json({ error: 'La acción debe ser un texto' });
    }

    const user = await getUser();

    await publishMessage('casa/luz', accion);

    res.json({ res: true, message: `Comando enviado: ${accion}`, user });
  } catch (error) {
    console.log(error);
  }
};
