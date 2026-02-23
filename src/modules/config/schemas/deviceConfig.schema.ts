import { z } from 'zod';

const regexMac = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

export const deviceConfigSchema = z.object({
  mac: z
    .string('La dirección MAC es obligatoria')
    .trim()
    .min(1, 'La dirección MAC es obligatoria')
    .regex(regexMac, 'La dirección MAC no es válida'),
  config: z.object(
    {
      accion: z
        .string('La acción es obligatoria')
        .min(1, 'La acción es obligatoria')
        .max(30, 'La acción no debe exceder los 30 caracteres'),
    },
    'La configuración es obligatoria',
  ),
});
