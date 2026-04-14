import { HoraryDoesNotExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToDeleteHorary = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const horaryExists = await tx.horarios.findFirst({
      where: {
        id: id,
        eliminado_el: null,
      },
    });

    if (!horaryExists) throw new HoraryDoesNotExists();

    await tx.horario_detalles.deleteMany({
      where: { horario_id: id },
    });

    const deletedHorary = await tx.horarios.update({
      where: { id: id },
      data: {
        eliminado_el: new Date(),
      },
    });

    return deletedHorary;
  });
};
