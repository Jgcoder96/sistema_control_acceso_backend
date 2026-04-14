import { dia_semana_enum } from '@prisma/client';
import { HoraryAlreadyExists } from '../errors/index.js';
import { InvalidHorary } from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import {
  prepareTimeToPrisma,
  validateScheduleOverlaps,
} from '../utils/index.js';
import type { HoraryInRequestBody } from '../types/index.js';

export const transactionToCreateHorary = async (
  horary: HoraryInRequestBody,
) => {
  const { nombre, detalles } = horary;

  const overlapError = validateScheduleOverlaps(detalles);

  if (overlapError) throw new InvalidHorary(overlapError);

  return await prisma.$transaction(async (tx) => {
    const horaryExists = await tx.horarios.findFirst({
      where: { nombre, eliminado_el: null },
    });

    if (horaryExists) throw new HoraryAlreadyExists();

    const dataToInsert = detalles.map((d) => ({
      dia_semana: (d.es_festivo
        ? null
        : (d.dia_semana ?? null)) as dia_semana_enum | null,

      es_festivo: d.es_festivo,
      hora_inicio: prepareTimeToPrisma(d.hora_inicio),
      hora_fin: prepareTimeToPrisma(d.hora_fin),
    }));

    const newHorary = await tx.horarios.create({
      data: {
        nombre: nombre,
        horario_detalles: {
          create: dataToInsert,
        },
      },
    });

    return newHorary;
  });
};
