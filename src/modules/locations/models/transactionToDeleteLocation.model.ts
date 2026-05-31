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

    const deleteDate = new Date();

    // 2. Realizar el soft delete de la ubicación
    const deletedLocation = await tx.ubicaciones.update({
      where: { id: id },
      data: {
        eliminado_el: deleteDate,
      },
    });

    await tx.puntos_acceso.updateMany({
      where: {
        ubicacion_id: id,
        eliminado_el: null,
      },
      data: {
        eliminado_el: deleteDate,
        version: {
          increment: 1,
        },
        esta_sincronizado: false,
      },
    });

    return deletedLocation;
  });
};
