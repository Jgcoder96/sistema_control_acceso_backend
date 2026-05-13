import { prisma } from '../../../config/index.js';
import { UserDoesNotExist, RoleDoesNotExist } from '../errors/index.js';
import type { RolesInRequestBody } from '../types/index.js';

export const transactionToAssignRolesToUser = async (
  userId: string,
  data: RolesInRequestBody,
) => {
  const { rolesIds } = data;

  return await prisma.$transaction(async (tx) => {
    const user = await tx.usuarios.findFirst({
      where: {
        id: userId,
        eliminado_el: null,
      },
    });

    if (!user) throw new UserDoesNotExist();

    if (rolesIds.length > 0) {
      const uniqueRolesIds = [...new Set(rolesIds)];

      const count = await tx.roles.count({
        where: {
          id: { in: uniqueRolesIds },
          eliminado_el: null,
        },
      });

      if (count !== uniqueRolesIds.length) throw new RoleDoesNotExist();
    }

    await tx.usuario_roles.deleteMany({
      where: {
        usuario_id: userId,
      },
    });

    if (rolesIds.length > 0) {
      const newRoles = rolesIds.map((rolId) => ({
        usuario_id: userId,
        rol_id: rolId,
      }));

      await tx.usuario_roles.createMany({
        data: newRoles,
      });
    }

    return await tx.usuarios.findUnique({
      where: { id: userId },
      include: {
        usuario_roles: {
          include: {
            roles: {
              select: {
                id: true,
                nombre: true,
                descripcion: true,
              },
            },
          },
        },
      },
    });
  });
};
