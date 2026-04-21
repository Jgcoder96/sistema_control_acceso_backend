import { z } from 'zod';

export const validateLocationFiltersInQuery = z.object({
  status: z
    .enum(
      ['active', 'deleted', 'all'],
      "El estado debe ser 'active', 'deleted' o 'all'",
    )
    .default('all'),

  search: z.string().optional(),

  page: z.coerce
    .number('La página debe ser un número')
    .int('La página debe ser un número entero')
    .min(1, 'La página mínima es 1')
    .default(1),

  limit: z.coerce
    .number('El límite debe ser un número')
    .int('El límite debe ser un número entero')
    .min(1, 'El límite mínimo es 1')
    .max(100, 'El límite máximo es 100')
    .default(10),
});
