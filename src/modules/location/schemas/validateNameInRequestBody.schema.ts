import { z } from 'zod';

export const validateNameInRequestBody = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .min(4, 'El nombre es demasiado corto')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .trim(),
});
