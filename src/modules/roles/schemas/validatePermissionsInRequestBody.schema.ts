import { z } from 'zod';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validatePermissionsInRequestBody = z.object(
  {
    permisosIds: z.array(
      z
        .string('Los elementos del arreglo deben ser string.')
        .regex(uuidRegex, 'El parametro de la petición no es un UUID válido.'),
      "El campo 'permisosIds' es obligatorio y debe ser un arreglo.",
    ),
  },

  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
