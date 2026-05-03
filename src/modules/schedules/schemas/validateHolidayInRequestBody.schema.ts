import { z } from 'zod';

export const validateHolidayInRequestBody = z.object({
  nombre: z
    .string("El campo 'nombre' es obligatorio y debe ser una cadena de texto.")
    .min(4, "El campo 'nombre' debe contener al menos 4 caracteres.")
    .max(100, "El campo 'nombre' no debe exceder los 100 caracteres."),
  dia: z
    .number("El campo 'día' es obligatorio y debe ser un número.")
    .int("El campo 'día' debe ser un número entero.")
    .min(1, "El campo 'día' debe ser un número entre 1 y 31.")
    .max(31, "El campo 'día' debe ser un número entre 1 y 31."),
  mes: z
    .number("El campo 'mes' es obligatorio y debe ser un número.")
    .int("El campo 'mes' debe ser un número entero.")
    .min(1, "El campo 'mes' debe ser un número entre 1 y 12.")
    .max(12, "El campo 'mes' debe ser un número entre 1 y 12"),
  anio: z
    .number("El campo 'año' debe ser un número.")
    .int("El campo 'año' debe ser un número entero.")
    .min(2026, "El campo 'año' debe ser un número entre 2026 y 2100.")
    .max(2100, "El campo 'año' debe ser un número entre 2026 y 2100.")
    .nullable()
    .optional(),
});
