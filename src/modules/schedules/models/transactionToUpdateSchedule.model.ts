import { dia_semana_enum } from '@prisma/client';
import {
  InvalidSchedule,
  ScheduleAlreadyExists,
  ScheduleDoesNotExists,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import {
  prepareTimeToPrisma,
  validateScheduleOverlaps,
} from '../utils/index.js';
import type { ScheduleInRequestBody } from '../types/index.js';

export const transactionToUpdateSchedule = async (
  id: string,
  schedule: ScheduleInRequestBody,
) => {
  const { nombre, detalles } = schedule;

  const overlapError = validateScheduleOverlaps(detalles);
  if (overlapError) throw new InvalidSchedule(overlapError);

  return await prisma.$transaction(async (tx) => {
    const currentSchedule = await tx.horarios.findFirst({
      where: { id, eliminado_el: null },
      include: { horario_detalles: true },
    });

    if (!currentSchedule) throw new ScheduleDoesNotExists();

    if (currentSchedule.nombre !== nombre) {
      const duplicateName = await tx.horarios.findFirst({
        where: {
          nombre: nombre,
          eliminado_el: null,
          NOT: { id: id },
        },
      });
      if (duplicateName) throw new ScheduleAlreadyExists();
    }

    const newDataToInsert = detalles.map((d) => ({
      dia_semana: (d.es_festivo
        ? null
        : (d.dia_semana ?? null)) as dia_semana_enum | null,
      es_festivo: d.es_festivo,
      hora_inicio: prepareTimeToPrisma(d.hora_inicio).toISOString(),
      hora_fin: prepareTimeToPrisma(d.hora_fin).toISOString(),
      horario_id: id,
    }));

    const currentDetailsFormatted = currentSchedule.horario_detalles.map(
      (d) => ({
        dia_semana: d.dia_semana,
        es_festivo: d.es_festivo,
        hora_inicio: d.hora_inicio.toISOString(),
        hora_fin: d.hora_fin.toISOString(),
        horario_id: d.horario_id,
      }),
    );

    const detailsChanged =
      JSON.stringify(newDataToInsert.sort()) !==
      JSON.stringify(currentDetailsFormatted.sort());
    const nameChanged = currentSchedule.nombre !== nombre;

    if (!nameChanged && !detailsChanged) {
      return currentSchedule;
    }

    if (detailsChanged) {
      await tx.horario_detalles.deleteMany({
        where: { horario_id: id },
      });

      await tx.horario_detalles.createMany({
        data: newDataToInsert.map((d) => ({
          ...d,
          hora_inicio: new Date(d.hora_inicio),
          hora_fin: new Date(d.hora_fin),
        })),
      });

      await tx.puntos_acceso.updateMany({
        where: {
          permisos_fisicos: {
            some: {
              horario_id: id,
              eliminado_el: null,
            },
          },
        },
        data: {
          version: {
            increment: 1,
          },
          esta_sincronizado: false,
        },
      });
    }

    const updatedSchedule = await tx.horarios.update({
      where: { id },
      data: { nombre },
    });

    return updatedSchedule;
  });
};
