import { prisma } from '../../../config/index.js';
import { RoleDoesNotExist } from '../errors/index.js';

export const getRoleByID = async (roleId: string) => {
  const role = await prisma.roles.findUnique({
    where: {
      id: roleId,
      eliminado_el: null,
    },
    include: {
      rol_permisos: {
        include: {
          app_permisos: true,
        },
      },
    },
  });

  if (!role) throw new RoleDoesNotExist();

  return {
    id: role.id,
    nombre: role.nombre,
    descripcion: role.descripcion,
    creado_el: role.creado_el,
    actualizado_el: role.actualizado_el,
    eliminado_el: role.eliminado_el,
    permisos: role.rol_permisos
      .map((rp) => rp.app_permisos)
      .filter((p) => p.eliminado_el === null),
  };
};
