import { z } from 'zod';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validatePhysicalPermitInRequestBody = z.object(
  {
    usuario_id: z
      .string('El ID es obligatorio.')
      .min(1, 'El ID es obligatorio.')
      .regex(uuidRegex, 'El formato del ID no es un UUID válido.'),
    punto_acceso_id: z
      .string('El ID es obligatorio.')
      .min(1, 'El ID es obligatorio.')
      .regex(uuidRegex, 'El formato del ID no es un UUID válido.'),
    horario_id: z
      .string('El ID es obligatorio.')
      .min(1, 'El ID es obligatorio.')
      .regex(uuidRegex, 'El formato del ID no es un UUID válido.'),
  },
  'El cuerpo de la solicitud debe ser un json con los campos usuario_id, punto_acceso_id y horario_id.',
);
