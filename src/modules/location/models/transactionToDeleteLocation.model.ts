import { LocationDoesNotExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToDeleteLocation = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const locationExists = await tx.ubicaciones.findFirst({
      where: {
        id: id,
        eliminado_el: null,
      },
    });

    if (!locationExists) throw new LocationDoesNotExists();

    const deletedLocation = await tx.ubicaciones.update({
      where: { id: id },
      data: {
        eliminado_el: new Date(),
      },
    });

    return deletedLocation;
  });
};
