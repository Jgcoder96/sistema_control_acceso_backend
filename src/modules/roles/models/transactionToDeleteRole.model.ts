import { prisma } from '../../../config/index.js';
import { RoleDoesNotExist } from '../errors/index.js';

export const transactionToDeleteRole = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const roleExists = await tx.roles.findFirst({
      where: {
        id: id,
        eliminado_el: null,
      },
    });

    if (!roleExists) throw new RoleDoesNotExist();

    const deletedRole = await tx.roles.update({
      where: { id: id },
      data: {
        eliminado_el: new Date(),
      },
    });

    return deletedRole;
  });
};
