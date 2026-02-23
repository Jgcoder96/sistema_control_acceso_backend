import { z } from 'zod';

export const configAllDevicesSchema = z.object({
  config: z.object(
    {
      accion: z
        .string('La Acción es obligatoria')
        .min(1, 'La Acción es obligatoria')
        .max(30, 'Maximo 30 caracteres'),
    },
    'La configuración es obligatoria',
  ),
});
