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

  const dateVzla = new Intl.DateTimeFormat('es-VE', {
    timeZone: 'America/Caracas',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return {
    id: role.id,
    nombre: role.nombre,
    descripcion: role.descripcion,
    // Formateo de fechas del Rol
    creado_el: role.creado_el ? dateVzla.format(role.creado_el) : null,
    actualizado_el: role.actualizado_el
      ? dateVzla.format(role.actualizado_el)
      : null,
    eliminado_el: role.eliminado_el ? dateVzla.format(role.eliminado_el) : null,

    permisos: role.rol_permisos
      .map((rp) => rp.app_permisos)
      .filter((p) => p.eliminado_el === null)
      .map((p) => ({
        ...p,
        creado_el: p.creado_el ? dateVzla.format(p.creado_el) : null,
        actualizado_el: p.actualizado_el
          ? dateVzla.format(p.actualizado_el)
          : null,
        eliminado_el: p.eliminado_el ? dateVzla.format(p.eliminado_el) : null,
      })),
  };
};
