import { z } from 'zod';

export const validateLoginInRequestBody = z.object(
  {
    correo_electronico: z
      .string(
        "El campo 'correo_electronico' es obligatorio y debe ser una cadena de texto.",
      )
      .email('Formato de correo electrónico no válido.')
      .trim(),

    clave: z
      .string("El campo 'clave' es obligatorio y debe ser una cadena de texto.")
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .max(100, 'La contraseña no puede exceder los 100 caracteres.')
      .regex(
        /[A-Z]/,
        'La contraseña debe incluir al menos una letra mayúscula.',
      )
      .regex(
        /[a-z]/,
        'La contraseña debe incluir al menos una letra minúscula.',
      )
      .regex(/[0-9]/, 'La contraseña debe incluir al menos un número.')
      .regex(
        /[^a-zA-Z0-9]/,
        'La contraseña debe incluir al menos un carácter especial.',
      )
      .trim(),
  },
  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
