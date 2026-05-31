import { HolidayAlreadyExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import type { HolidayInRequestBody } from '../types/index.js';

export const transactionToCreateHoliday = async (
  holiday: HolidayInRequestBody,
) => {
  const { nombre, dia, mes, anio } = holiday;

  return await prisma.$transaction(async (tx) => {
    const existingHoliday = await tx.festivos.findFirst({
      where: {
        OR: [
          { nombre: { equals: nombre, mode: 'insensitive' } },
          { dia, mes, anio: anio ?? null },
        ],
      },
    });

    if (existingHoliday) {
      if (existingHoliday.eliminado_el === null)
        throw new HolidayAlreadyExists();

      return await tx.festivos.update({
        where: { id: existingHoliday.id },
        data: {
          nombre,
          dia,
          mes,
          anio: anio ?? null,
          eliminado_el: null,
          actualizado_el: new Date(),
        },
      });
    }

    const newHoliday = await tx.festivos.create({
      data: {
        nombre,
        dia,
        mes,
        anio: anio ?? null,
      },
    });

    await tx.puntos_acceso.updateMany({
      where: {
        eliminado_el: null,
      },
      data: {
        version: { increment: 1 },
        esta_sincronizado: false,
      },
    });

    return newHoliday;
  });
};
