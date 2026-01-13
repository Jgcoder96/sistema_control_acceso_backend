import { z } from 'zod';

export const signUpSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  apellido: z.string().min(1, 'El apellido es obligatorio').max(100),

  cedula: z.coerce
    .number()
    .int('La cédula debe ser un número entero')
    .positive('La cédula debe ser un número positivo'),

  correo_electronico: z.string().email('Email inválido').max(255),

  clave: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Falta una mayúscula')
    .regex(/[a-z]/, 'Falta una minúscula')
    .regex(/[0-9]/, 'Falta un número')
    .regex(/[^a-zA-Z0-9]/, 'Falta un carácter especial'),

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
      'Solo se permiten formatos JPG, PNG y WebP',
    ),
});
