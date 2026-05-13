import { z } from 'zod';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateRolesInRequestBody = z.object(
  {
    rolesIds: z.array(
      z
        .string('Los elementos del arreglo deben ser un string.')
        .regex(uuidRegex, 'Los elementos del arreglo no son un UUID válido.'),
      "El campo 'rolesIds' es obligatorio y debe ser un arreglo.",
    ),
  },

  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
