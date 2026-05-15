import { z } from 'zod';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateAccessCardToAssignInRequestBody = z.object(
  {
    usuario_id: z
      .string(
        "El campo 'usuario_id' es obligatorio y debe ser una cadena de texto.",
      )
      .regex(uuidRegex, 'El formato del ID del usuario no es un UUID válido.')
      .trim(),
  },
  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
