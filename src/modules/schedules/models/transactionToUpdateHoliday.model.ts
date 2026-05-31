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

    const dateChanged =
      existingHoliday.dia !== dia ||
      existingHoliday.mes !== mes ||
      existingHoliday.anio !== normalizedYear;

    const nameChanged = existingHoliday.nombre !== nombre;

    if (!dateChanged && !nameChanged) return existingHoliday;

    if (nameChanged) {
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
    }

    const updatedHoliday = await tx.festivos.update({
      where: { id },
      data: {
        nombre,
        dia,
        mes,
        anio: normalizedYear,
      },
    });

    if (dateChanged) {
      await tx.puntos_acceso.updateMany({
        where: {
          eliminado_el: null,
        },
        data: {
          version: { increment: 1 },
          esta_sincronizado: false,
        },
      });
    }

    return updatedHoliday;
  });
};
