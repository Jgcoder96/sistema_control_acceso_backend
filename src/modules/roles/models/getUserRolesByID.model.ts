import { prisma } from '../../../config/index.js';
import { UserDoesNotExist } from '../errors/index.js';

export const getUserRolesByID = async (userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.usuarios.findUnique({
      where: {
        id: userId,
      },
      include: {
        usuario_roles: {
          include: {
            roles: {
              include: {
                rol_permisos: {
                  include: {
                    app_permisos: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new UserDoesNotExist();

    return user.usuario_roles
      .map((ur) => ur.roles)
      .filter((role) => role !== null && role.eliminado_el === null)
      .map((role) => ({
        id: role.id,
        nombre: role.nombre,
        descripcion: role.descripcion,
        creado_el: role.creado_el,
        actualizado_el: role.actualizado_el,
        permisos: role.rol_permisos
          .map((rp) => rp.app_permisos)
          .filter((p) => p !== null && p.eliminado_el === null),
      }));
  });
};
