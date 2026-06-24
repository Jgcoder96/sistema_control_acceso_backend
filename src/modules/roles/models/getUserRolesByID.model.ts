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
            roles: true,
          },
        },
      },
    });

    if (!user) throw new UserDoesNotExist();

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

    return user.usuario_roles
      .map((ur) => ur.roles)
      .filter((role) => role !== null && role.eliminado_el === null)
      .map((role) => ({
        id: role.id,
        nombre: role.nombre,
        descripcion: role.descripcion,
        // Fechas formateadas
        creado_el: role.creado_el ? dateVzla.format(role.creado_el) : null,
        actualizado_el: role.actualizado_el
          ? dateVzla.format(role.actualizado_el)
          : null,
      }));
  });
};
