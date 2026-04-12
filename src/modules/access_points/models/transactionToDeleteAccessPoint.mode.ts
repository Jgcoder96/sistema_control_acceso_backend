import { AccessPointDoesNotExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToDeleteAccessPoint = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const accessPointExists = await tx.puntos_acceso.findFirst({
      where: {
        id: id,
        eliminado_el: null,
      },
    });

    if (!accessPointExists) throw new AccessPointDoesNotExists();

    const deletedAccessPoint = await tx.puntos_acceso.update({
      where: { id: id },
      data: {
        eliminado_el: new Date(),
      },
    });

    return deletedAccessPoint;
  });
};
