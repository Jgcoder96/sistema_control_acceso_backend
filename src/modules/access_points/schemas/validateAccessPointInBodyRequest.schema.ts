import { z } from 'zod';

const regexMac = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateAccessPointInBodyRequest = z.object(
  {
    nombre: z
      .string("El campo 'nombre' es obligatorio.")
      .min(4, 'El nombre debe contener al menos 4 caracteres.')
      .max(100, 'El nombre no puede exceder los 100 caracteres.')
      .trim(),
    mac: z
      .string("El campo 'mac' es obligatorio.")
      .regex(regexMac, 'La dirección MAC no es válida.')
      .trim(),

    ubicacion_id: z
      .string("El campo 'ubicacion_id' es obligatorio.")
      .regex(uuidRegex, 'El formato del ID de ubicación no es un UUID válido.')
      .trim(),
  },
  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
