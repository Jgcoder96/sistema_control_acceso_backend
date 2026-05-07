import { z } from 'zod';

export const validateRoleInRequestBody = z.object(
  {
    nombre: z
      .string(
        "El campo 'nombre' es obligatorio y debe ser una cadena de texto.",
      )
      .min(4, "El campo 'nombre' debe contener al menos 4 caracteres.")
      .max(100, "El campo 'nombre' no puede exceder los 100 caracteres.")
      .trim(),
    descripcion: z
      .string(
        "El campo 'descripcion' es obligatorio y debe ser una cadena de texto.",
      )
      .min(4, "El campo 'descripcion' debe contener al menos 4 caracteres.")
      .max(100, "El campo 'descripcion' no puede exceder los 100 caracteres.")
      .trim(),
  },

  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
