import { prisma } from '../../../config/index.js';
import type { HolidayInRequestBody } from '../types/index.js';
import { HolidayDoesNotExists, HolidayAlreadyExists } from '../errors/index.js';

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

    const normalizedYear = anio ?? null;

    const hasChanges =
      existingHoliday.nombre !== nombre ||
      existingHoliday.dia !== dia ||
      existingHoliday.mes !== mes ||
      existingHoliday.anio !== normalizedYear;

    if (!hasChanges) return existingHoliday;

    const nameDuplicate = await tx.festivos.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
        id: { not: id },
        eliminado_el: null,
      },
    });

    if (nameDuplicate) throw new HolidayAlreadyExists();

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
