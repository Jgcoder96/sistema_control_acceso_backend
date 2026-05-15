import { z } from 'zod';

const rfidRegex = /^[a-fA-F0-9:-]+$/;

export const validateAccessCardInRequestBody = z.object(
  {
    codigo: z
      .string(
        "El campo 'codigo' es obligatorio y debe ser una cadena de texto.",
      )
      .trim()
      .regex(rfidRegex, 'El formato del código RFID no es válido.')
      .toUpperCase(),
  },
  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
