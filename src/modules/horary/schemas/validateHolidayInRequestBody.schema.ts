import { z } from 'zod';

export const validateHolidayInRequestBody = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .min(3, 'El nombre es muy corto')
    .max(100, 'El nombre no debe exceder los 100 caracteres'),
  dia: z
    .number('El día es obligatorio')
    .int('El día debe ser un número entero')
    .min(1, 'El día debe ser un número entre 1 y 31')
    .max(31, 'El día debe ser un número entre 1 y 31'),
  mes: z
    .number('El mes es obligatorio')
    .int('El mes debe ser un número entero')
    .min(1, 'El mes debe ser un número entre 1 y 12')
    .max(12, 'El mes debe ser un número entre 1 y 12'),
  anio: z
    .number('El año es obligatorio')
    .int('El año debe ser un número entero')
    .min(2000, 'El año debe ser un número entre 2000 y 2100')
    .max(2100, 'El año debe ser un número entre 2000 y 2100')
    .nullable()
    .optional(),
});
