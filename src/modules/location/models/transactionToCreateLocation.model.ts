import { LocationAlreadyExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToCreateLocation = async (name: string) => {
  return await prisma.$transaction(async (tx) => {
    const location = await tx.ubicaciones.findFirst({
      where: {
        nombre: name,
      },
    });

    if (location) {
      if (location.eliminado_el === null) throw new LocationAlreadyExists();

      const restoredLocation = await tx.ubicaciones.update({
        where: { id: location.id },
        data: {
          eliminado_el: null,
          actualizado_el: new Date(),
        },
      });

      return restoredLocation;
    }

    const newLocation = await tx.ubicaciones.create({
      data: { nombre: name },
    });

    return newLocation;
  });
};
