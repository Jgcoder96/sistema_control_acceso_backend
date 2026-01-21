import { z } from 'zod';

export const signUpSchema = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no debe exceder los 100 caracteres'),

  apellido: z
    .string('El apellido es obligatorio')
    .min(1, 'El apellido es obligatorio')
    .max(100, 'El apellido no debe exceder los 100 caracteres'),

  cedula: z
    .string('La cédula es obligatoria')
    .min(7, 'La cédula debe tener al menos 7 dígitos')
    .max(8, 'La cédula no debe exceder los 8 dígitos')
    .regex(/^[0-9]+$/, 'La cédula debe contener solo números'),

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

  estado: z.enum(['activo', 'inactivo']).default('activo'),

  foto: z
    .any()
    .refine((file) => !!file, 'La foto de perfil es obligatoria')
    .refine(
      (file) => file?.size <= 5 * 1024 * 1024,
      'La foto no debe pesar más de 5MB',
    )
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file?.mimetype),
      'Solo se permiten formatos Jpeg, PNG y WebP',
    ),
});
