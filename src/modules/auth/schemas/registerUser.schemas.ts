import { z } from 'zod';

export const registerUserSchema = z.object({
  nombre: z
    .string('debe ser un texto')
    .min(3, 'minimo 3 caracteres')
    .max(30, 'maximo 30 caracteres'),
  apellido: z
    .string('debe ser un texto')
    .min(3, 'minimo 3 caracteres')
    .max(30, 'maximo 30 caracteres'),
  accion: z
    .string('debe ser un texto')
    .min(3, 'minimo 3 caracteres')
    .max(30, 'maximo 30 caracteres'),
});
