import { z } from 'zod';

export const validateNameInRequestBody = z.object(
  {
    nombre: z
      .string("El campo 'nombre' es obligatorio.")
      .min(4, 'El nombre debe contener al menos 4 caracteres.')
      .max(100, 'El nombre no puede exceder los 100 caracteres.')
      .trim(),
  },
  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
