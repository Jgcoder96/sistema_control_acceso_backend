import { z } from 'zod';

export const validateAppPermissionInRequestBody = z.object(
  {
    slug: z
      .string("El campo 'slug' es obligatorio y debe ser una cadena de texto.")
      .trim()
      .min(4, "El campo 'slug' debe contener al menos 4 caracteres.")
      .max(100, "El campo 'slug' no puede exceder los 100 caracteres.")
      .toLowerCase()
      .regex(
        /^[a-z0-9._-]+$/,
        'El slug solo puede contener letras minúsculas, números, puntos, guiones y guiones bajos (sin espacios).',
      ),
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
