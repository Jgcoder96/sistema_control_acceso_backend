import { z } from 'zod';

export const signInSchema = z.object({
  correo_electronico: z
    .string('El correo electrónico es obligatorio')
    .min(1, 'El correo electrónico es obligatorio')
    .email('Formato de correo electrónico no válido')
    .max(255, 'El correo electrónico no debe exceder los 255 caracteres'),

  clave: z
    .string('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe incluir al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe incluir al menos un número')
    .regex(
      /[^a-zA-Z0-9]/,
      'Debe incluir al menos un carácter especial (ej. @, #, $, %)',
    ),
});
