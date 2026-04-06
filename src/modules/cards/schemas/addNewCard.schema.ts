import { z } from 'zod';

const rfidRegex = /^[a-fA-F0-9:-]+$/;

export const addCardsSchema = z.object({
  codigo: z
    .string('El código RFID es obligatorio')
    .min(4, 'El código es demasiado corto')
    .max(20, 'El código no puede exceder los 20 caracteres')
    .trim()
    .regex(
      rfidRegex,
      'Formato de código RFID no válido (use Hexadecimal o Decimal)',
    )
    .toUpperCase(),
});
