import { RoleAlreadyExist, RoleDoesNotExist } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export interface RoleInBodyRequest {
  nombre: string;
  descripcion: string;
}

export const transactionToUpdateRole = async (
  id: string,
  data: RoleInBodyRequest,
) => {
  const { nombre, descripcion } = data;

  return await prisma.$transaction(async (tx) => {
    // 1. Check if the role exists and is not deleted
    const currentRole = await tx.roles.findFirst({
      where: {
        id,
        eliminado_el: null,
      },
    });

    if (!currentRole) throw new RoleDoesNotExist();

    const isSameName =
      currentRole.nombre.toLowerCase() === nombre.toLowerCase();
    const isSameDescription = (currentRole.descripcion || '') === descripcion;

    if (isSameName && isSameDescription) {
      return currentRole; // Return immediately without updating the DB
    }

    if (!isSameName) {
      const nameExistsInAnotherRole = await tx.roles.findFirst({
        where: {
          nombre: {
            equals: nombre,
            mode: 'insensitive',
          },
          id: { not: id },
          eliminado_el: null,
        },
      });

      if (nameExistsInAnotherRole) throw new RoleAlreadyExist();
    }

    const updatedRole = await tx.roles.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        actualizado_el: new Date(),
      },
    });

    return updatedRole;
  });
};
