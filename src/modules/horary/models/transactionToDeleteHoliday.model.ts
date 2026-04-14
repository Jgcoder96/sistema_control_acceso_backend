import { HolidayDoesNotExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToDeleteHoliday = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const holidayExists = await tx.festivos.findFirst({
      where: {
        id: id,
        eliminado_el: null,
      },
    });

    if (!holidayExists) throw new HolidayDoesNotExists();

    const deletedHoliday = await tx.festivos.update({
      where: { id: id },
      data: {
        eliminado_el: new Date(),
      },
    });

    return deletedHoliday;
  });
};
