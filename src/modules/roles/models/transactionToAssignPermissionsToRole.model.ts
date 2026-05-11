import { prisma } from '../../../config/index.js';
import { RoleDoesNotExist, PermissionsDoesNotExist } from '../errors/index.js';
import type { PermissionsInRequestBody } from '../types/index.js';

export const transactionToAssignPermissionsToRole = async (
  rolId: string,
  data: PermissionsInRequestBody,
) => {
  const { permisosIds } = data;

  return await prisma.$transaction(async (tx) => {
    const role = await tx.roles.findFirst({
      where: {
        id: rolId,
        eliminado_el: null,
      },
    });

    if (!role) throw new RoleDoesNotExist();

    if (permisosIds.length > 0) {
      const uniquePermisosIds = [...new Set(permisosIds)];

      const count = await tx.app_permisos.count({
        where: {
          id: { in: uniquePermisosIds },
        },
      });

      if (count !== uniquePermisosIds.length) {
        throw new PermissionsDoesNotExist();
      }
    }

    await tx.rol_permisos.deleteMany({
      where: {
        rol_id: rolId,
      },
    });

    if (permisosIds.length > 0) {
      const newPermissions = permisosIds.map((permisoId) => ({
        rol_id: rolId,
        permiso_id: permisoId,
      }));

      await tx.rol_permisos.createMany({
        data: newPermissions,
        skipDuplicates: true,
      });
    }

    return await tx.roles.findUnique({
      where: { id: rolId },
      include: {
        rol_permisos: {
          include: {
            app_permisos: true,
          },
        },
      },
    });
  });
};
