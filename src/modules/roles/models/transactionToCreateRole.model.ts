import { RoleAlreadyExist } from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import type { RoleInBodyRequest } from '../types/index.js';

export const transactionToCreateRole = async (data: RoleInBodyRequest) => {
  const { nombre, descripcion } = data;

  return await prisma.$transaction(async (tx) => {
    const role = await tx.roles.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
      orderBy: {
        eliminado_el: 'asc',
      },
    });

    if (role) {
      if (role.eliminado_el === null) throw new RoleAlreadyExist();

      const restoredRole = await tx.roles.update({
        where: { id: role.id },
        data: {
          nombre: nombre,
          descripcion: descripcion,
          eliminado_el: null,
        },
      });

      return restoredRole;
    }

    const newRole = await tx.roles.create({
      data: {
        nombre,
        descripcion,
      },
    });

    return newRole;
  });
};
