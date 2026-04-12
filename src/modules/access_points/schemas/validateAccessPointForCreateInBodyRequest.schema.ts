import { z } from 'zod';

const regexMac = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateAccessPointForCreateInBodyRequest = z.object(
  {
    nombre: z
      .string('El nombre es obligatorio')
      .min(1, 'El nombre es obligatorio')
      .max(100, 'El nombre no puede exceder los 100 caracteres')
      .trim(),
    mac: z
      .string('La dirección MAC es obligatoria')
      .trim()
      .min(1, 'La dirección MAC es obligatoria')
      .regex(regexMac, 'La dirección MAC no es válida'),
    ubicacion_id: z
      .string('El ID de ubicación es obligatorio')
      .min(1, 'El ID de ubicación es obligatorio')
      .regex(uuidRegex, 'El formato del ID de ubicación no es un UUID válido'),
  },
  'El cuerpo de la solicitud no es válido',
);
