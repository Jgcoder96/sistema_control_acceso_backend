import { ScheduleDoesNotExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToDeleteSchedule = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const scheduleExists = await tx.horarios.findFirst({
      where: {
        id: id,
        eliminado_el: null,
      },
    });

    if (!scheduleExists) throw new ScheduleDoesNotExists();

    await tx.horario_detalles.deleteMany({
      where: { horario_id: id },
    });

    const deletedSchedule = await tx.horarios.update({
      where: { id: id },
      data: {
        eliminado_el: new Date(),
      },
    });

    return deletedSchedule;
  });
};
