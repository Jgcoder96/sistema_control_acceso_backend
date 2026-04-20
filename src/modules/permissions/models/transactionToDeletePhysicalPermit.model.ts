import { PhysicalPermitDoesNotExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToDeletePhysicalPermit = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const physicalPermitExists = await tx.permisos_fisicos.findFirst({
      where: {
        id: id,
        eliminado_el: null,
      },
    });

    if (!physicalPermitExists) throw new PhysicalPermitDoesNotExists();

    const deletedPhysicalPermit = await tx.permisos_fisicos.update({
      where: { id: id },
      data: {
        eliminado_el: new Date(),
      },
    });

    return deletedPhysicalPermit;
  });
};
