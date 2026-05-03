import { z } from 'zod';

const hourRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const validateScheduleInRequestBody = z.object(
  {
    nombre: z
      .string(
        "El campo 'nombre' es obligatorio y debe ser una cadena de texto.",
      )
      .min(4, "El campo 'nombre' debe contener al menos 4 caracteres.")
      .max(100, "El campo 'nombre' no puede exceder los 100 caracteres.")
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
              'El día de la semana es inválido.',
            )
            .optional(),

          hora_inicio: z
            .string(
              "El campo 'hora_inicio' es obligatorio y debe ser una cadena de texto.",
            )
            .regex(
              hourRegex,
              'El formato de la hora de inicio es inválido (HH:mm:ss).',
            ),

          hora_fin: z
            .string(
              "El campo 'hora_fin' es obligatorio y debe ser una cadena de texto.",
            )
            .regex(
              hourRegex,
              'El formato de la hora de fin es inválido (HH:mm:ss).',
            ),

          es_festivo: z.boolean(
            "El campo 'es_festivo' es obligatorio y debe ser un valor booleano.",
          ),
        }),
        'Los detalles del horario son obligatorios y deben ser un arreglo de objetos con la estructura correcta.',
      )
      .min(1, 'Debe incluir al menos un detalle en el horario.'),
  },
  'La estructura del cuerpo de la solicitud no es válida. Se requiere un objeto JSON.',
);
