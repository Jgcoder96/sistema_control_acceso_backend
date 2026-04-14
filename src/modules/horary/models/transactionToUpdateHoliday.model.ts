import { prisma } from '../../../config/index.js';
import type { HolidayInRequestBody } from '../types/index.js';
import { HolidayDoesNotExists } from '../errors/index.js';

export const transactionToUpdateHoliday = async (
  id: string,
  horary: HolidayInRequestBody,
) => {
  const { nombre, dia, mes, anio } = horary;

  return await prisma.$transaction(async (tx) => {
    const existingHoliday = await tx.festivos.findFirst({
      where: {
        id,
        eliminado_el: null,
      },
    });

    if (!existingHoliday) throw new HolidayDoesNotExists();

    const updatedHoliday = await tx.festivos.update({
      where: { id },
      data: {
        nombre,
        dia,
        mes,
        anio: anio ?? null,
      },
    });

    return updatedHoliday;
  });
};
