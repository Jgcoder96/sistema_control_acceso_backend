import { z } from 'zod';

export const validateIdInRequestParams = z.object({
  id: z.string('El ID es obligatorio').uuid('El ID debe ser un UUID válido'),
});
