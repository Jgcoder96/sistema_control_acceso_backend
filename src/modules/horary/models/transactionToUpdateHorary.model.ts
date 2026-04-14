import { dia_semana_enum } from '@prisma/client';
import { HoraryDoesNotExists } from '../errors/index.js';
import { InvalidHorary } from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import {
  prepareTimeToPrisma,
  validateScheduleOverlaps,
} from '../utils/index.js';
import type { HoraryInRequestBody } from '../types/index.js';

export const transactionToUpdateHorary = async (
  id: string,
  horary: HoraryInRequestBody,
) => {
  const { nombre, detalles } = horary;

  const overlapError = validateScheduleOverlaps(detalles);

  if (overlapError) throw new InvalidHorary(overlapError);

  return await prisma.$transaction(async (tx) => {
    const horaryExists = await tx.horarios.findFirst({
      where: { id, eliminado_el: null },
    });

    if (!horaryExists) throw new HoraryDoesNotExists();

    const dataToInsert = detalles.map((d) => ({
      dia_semana: (d.es_festivo
        ? null
        : (d.dia_semana ?? null)) as dia_semana_enum | null,

      es_festivo: d.es_festivo,
      hora_inicio: prepareTimeToPrisma(d.hora_inicio),
      hora_fin: prepareTimeToPrisma(d.hora_fin),
      horario_id: id,
    }));

    await tx.horario_detalles.deleteMany({
      where: { horario_id: id },
    });

    await tx.horario_detalles.createMany({
      data: dataToInsert,
    });

    const updateHorary = await tx.horarios.update({
      where: { id },
      data: { nombre },
    });

    return updateHorary;
  });
};
