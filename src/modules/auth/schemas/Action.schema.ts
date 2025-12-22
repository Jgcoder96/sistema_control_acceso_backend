import { z } from 'zod';

export const Action = z.object({
  accion: z
    .string('debe ser un texto')
    .min(3, 'minimo 3 caracteres')
    .max(30, 'maximo 30 caracteres'),
});
