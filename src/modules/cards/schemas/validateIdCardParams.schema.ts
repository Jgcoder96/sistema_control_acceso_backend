import { z } from 'zod';

export const validateIdCardParamsSchema = z.object({
  id: z
    .string('El ID de la tarjeta es obligatorio')
    .uuid('El ID de la tarjeta en la URL debe ser un UUID válido'),
});
