import {
  LocationAlreadyExists,
  LocationDoesNotExists,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToUpdateLocation = async (id: string, name: string) => {
  return await prisma.$transaction(async (tx) => {
    const locationExists = await tx.ubicaciones.findFirst({
      where: { id, eliminado_el: null },
    });

    if (!locationExists) throw new LocationDoesNotExists();

    if (locationExists.nombre.toLowerCase() === name.toLowerCase()) {
      return locationExists;
    }

    const nameExistsInAnotherLocation = await tx.ubicaciones.findFirst({
      where: {
        nombre: {
          equals: name,
          mode: 'insensitive',
        },
        id: { not: id },
        eliminado_el: null,
      },
    });

    if (nameExistsInAnotherLocation) throw new LocationAlreadyExists();

    const updatedLocation = await tx.ubicaciones.update({
      where: { id },
      data: { nombre: name },
    });

    return updatedLocation;
  });
};
