import { dia_semana_enum } from '@prisma/client';
import { ScheduleAlreadyExists } from '../errors/index.js';
import { InvalidSchedule } from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import {
  prepareTimeToPrisma,
  validateScheduleOverlaps,
} from '../utils/index.js';
import type { ScheduleInRequestBody } from '../types/index.js';

export const transactionToCreateSchedule = async (
  schedule: ScheduleInRequestBody,
) => {
  const { nombre, detalles } = schedule;

  const overlapError = validateScheduleOverlaps(detalles);

  if (overlapError) throw new InvalidSchedule(overlapError);

  return await prisma.$transaction(async (tx) => {
    const scheduleExists = await tx.horarios.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
        eliminado_el: null,
      },
    });

    if (scheduleExists) throw new ScheduleAlreadyExists();

    const dataToInsert = detalles.map((d) => ({
      dia_semana: (d.es_festivo
        ? null
        : (d.dia_semana ?? null)) as dia_semana_enum | null,

      es_festivo: d.es_festivo,
      hora_inicio: prepareTimeToPrisma(d.hora_inicio),
      hora_fin: prepareTimeToPrisma(d.hora_fin),
    }));

    const newSchedule = await tx.horarios.create({
      data: {
        nombre: nombre,
        horario_detalles: {
          create: dataToInsert,
        },
      },
    });

    return newSchedule;
  });
};
