import { z } from 'zod';

export const validateFiltersInQuery = z.object({
  status: z
    .enum(
      ['active', 'deleted', 'all'],
      "El estado de la consulta debe ser 'active', 'deleted' o 'all'.",
    )
    .default('all'),

  search: z.string().optional(),

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
