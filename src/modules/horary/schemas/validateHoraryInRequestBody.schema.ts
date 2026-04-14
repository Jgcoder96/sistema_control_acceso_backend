import { z } from 'zod';

const hourRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const validateHoraryInRequestBody = z.object({
  nombre: z
    .string('El nombre es obligatorio')
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .trim(),

  detalles: z
    .array(
      z.object({
        dia_semana: z
          .enum(
            [
              'lunes',
              'martes',
              'miercoles',
              'jueves',
              'viernes',
              'sabado',
              'domingo',
            ],
            'El día de la semana es inválido',
          )
          .optional(),

        hora_inicio: z
          .string()
          .regex(hourRegex, 'Formato de hora de inicio inválido (HH:mm:ss)'),

        hora_fin: z
          .string()
          .regex(hourRegex, 'Formato de hora de fin inválido (HH:mm:ss)'),

        es_festivo: z.boolean('es_festivo es obligatorio'),
      }),
      'Los detalles deben ser un arreglo de objetos',
    )
    .min(1, 'Debe incluir al menos un detalle en el turno'),
});
