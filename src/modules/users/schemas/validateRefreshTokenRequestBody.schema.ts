import { z } from 'zod';

export const validateRefreshRequestBody = z.object(
  {
    token: z
      .string(`El campo 'token' es obligatorio y debe ser una cadena de texto.`)
      .min(1, "El campo 'refresh_token' debe contener al menos 4 caracteres.")
      .regex(
        /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
        'El formato del token no es válido.',
      )
      .trim(),
  },
  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);

export type RefreshRequestBody = z.infer<typeof validateRefreshRequestBody>;
