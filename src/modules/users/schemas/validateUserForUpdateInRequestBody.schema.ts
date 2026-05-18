import { z } from 'zod';

export const validateUserForUpdateInRequestBody = z.object({
  nombre: z
    .string("El campo 'nombre' es obligatorio y debe ser una cadena de texto.")
    .min(4, "El campo 'nombre' debe contener al menos 4 caracteres.")
    .max(100, "El campo 'nombre' no puede exceder los 100 caracteres.")
    .trim(),

  apellido: z
    .string(
      "El campo 'apellido' es obligatorio y debe ser una cadena de texto.",
    )
    .min(4, "El campo 'apellido' debe contener al menos 4 caracteres.")
    .max(100, "El campo 'apellido' no puede exceder los 100 caracteres.")
    .trim(),

  cedula: z
    .string("El campo 'cedula' es obligatorio y debe ser una cadena de texto.")
    .min(7, "El campo 'cedula' debe contener al menos 7 digitos.")
    .max(8, "El campo 'cedula' no puede exceder los 8 digitos.")
    .regex(/^[0-9]+$/, "El campo 'cedula' debe contener solo números")
    .trim(),

  correo_electronico: z
    .string(
      "El campo 'correo_electronico' es obligatorio y debe ser una cadena de texto.",
    )
    .email('Formato de correo electrónico no válido.')
    .trim(),

  clave: z
    .string("El campo 'clave' debe ser una cadena de texto.")
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .max(100, 'La contraseña no puede exceder los 100 caracteres.')
    .regex(/[A-Z]/, 'La contraseña debe incluir al menos una letra mayúscula.')
    .regex(/[a-z]/, 'La contraseña debe incluir al menos una letra minúscula.')
    .regex(/[0-9]/, 'La contraseña debe incluir al menos un número.')
    .regex(
      /[^a-zA-Z0-9]/,
      'La contraseña debe incluir al menos un carácter especial.',
    )
    .trim()
    .optional(),

  estado: z.enum(['activo', 'inactivo']).default('activo'),

  foto: z
    .any()
    .refine((file) => !!file, 'La foto de perfil es obligatoria.')
    .refine(
      (file) => file?.size <= 5 * 1024 * 1024,
      'La foto no debe pesar más de 5MB.',
    )
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file?.mimetype),
      'Solo se permiten formatos Jpeg, PNG y WebP.',
    )
    .optional(),
});
