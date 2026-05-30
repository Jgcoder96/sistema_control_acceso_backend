import { z } from 'zod';

const meshIdRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

export const validateLocationInRequestBody = z.object(
  {
    nombre: z
      .string(
        "El campo 'nombre' es obligatorio y debe ser una cadena de texto.",
      )
      .min(4, "El campo 'nombre' debe contener al menos 4 caracteres.")
      .max(100, "El campo 'nombre' no puede exceder los 100 caracteres.")
      .trim(),
    mesh_id: z
      .string(
        "El campo 'mesh_id' es obligatorio y debe ser una cadena de texto.",
      )
      .regex(
        meshIdRegex,
        "El 'mesh_id' debe ser un formato hexadecimal válido (ej: 77:77:77:77:77:77).",
      )
      .toUpperCase()
      .trim(),
  },
  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
