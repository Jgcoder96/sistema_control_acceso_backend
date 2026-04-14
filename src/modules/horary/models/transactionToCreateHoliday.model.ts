import { prisma } from '../../../config/index.js';

import type { HolidayInRequestBody } from '../types/index.js';

export const transactionToCreateHoliday = async (
  holiday: HolidayInRequestBody,
) => {
  const { nombre, dia, mes, anio } = holiday;

  return await prisma.$transaction(async (tx) => {
    const newHoliday = await tx.festivos.create({
      data: {
        nombre,
        dia,
        mes,
        anio: anio ?? null,
      },
    });

    return newHoliday;
  });
};
