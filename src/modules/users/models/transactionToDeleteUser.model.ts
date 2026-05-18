import { prisma } from '../../../config/index.js';
import { UserDoesNotExist } from '../errors/index.js';

export const transactionToDeleteUser = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const userExists = await tx.usuarios.findFirst({
      where: {
        id: id,
        eliminado_el: null,
      },
    });

    if (!userExists) throw new UserDoesNotExist();

    const deletedUser = await tx.usuarios.update({
      where: { id: id },
      data: {
        eliminado_el: new Date(),
        estado: 'inactivo',
      },
    });

    return deletedUser;
  });
};
