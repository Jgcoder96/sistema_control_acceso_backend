import { LocationAlreadyExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToUpdateLocation = async (id: string, name: string) => {
  return await prisma.$transaction(async (tx) => {
    const location = await tx.ubicaciones.findFirst({
      where: {
        nombre: name,
        id: { not: id },
      },
    });

    if (location !== null) throw new LocationAlreadyExists();

    const updatedLocation = await tx.ubicaciones.update({
      where: { id },
      data: { nombre: name },
    });

    return updatedLocation;
  });
};
