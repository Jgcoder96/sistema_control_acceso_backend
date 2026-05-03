import { z } from 'zod';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateIdInRequestParams = z.object({
  id: z
    .string('El parametro de la petición es obligatorio.')
    .regex(uuidRegex, 'El parametro de la petición no es un UUID válido.'),
});
