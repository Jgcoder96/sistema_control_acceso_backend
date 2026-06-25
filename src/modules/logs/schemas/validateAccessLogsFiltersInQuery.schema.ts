import { z } from 'zod';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateAccessLogsFiltersInQuery = z.object({
  cedula: z
    .string("El parametro 'nombre' debe ser una cadena de texto.")
    .optional(),

  tarjeta: z
    .string("El parametro 'tarjeta' debe ser una cadena de texto.")
    .optional(),

  puntoDeAccesoId: z
    .string("El campo 'puntoDeAccesoId' debe ser una cadena de texto.")
    .regex(uuidRegex, "El parametro 'puntoDeAccesoId' no es un UUID válido.")
    .optional(),

  ubicacionId: z
    .string("El campo 'ubicacionId' debe ser una cadena de texto.")
    .regex(uuidRegex, "El parametro 'ubicacionId' no es un UUID válido.")
    .optional(),

  page: z.coerce
    .number('La página de la consulta debe ser un número.')
    .int('La página de la consulta debe ser un número entero.')
    .min(1, 'La página mínima de la consulta es 1.')
    .default(1),

  limit: z.coerce
    .number('El límite de la consulta debe ser un número.')
    .int('El límite de la consulta debe ser un número entero.')
    .min(1, 'El límite mínimo de la consulta es 1.')
    .max(100, 'El límite máximo de la consulta es 100.')
    .default(10),
});
