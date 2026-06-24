import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
// Asumiendo que tienes un tipo similar para permisos o puedes reutilizar uno genérico
import type { AppPermissionFilters } from '../types/index.js';

export const getAppPermissions = async (filters: AppPermissionFilters) => {
  const where: Prisma.app_permisosWhereInput = {};
  const { status, search, page, limit } = filters;

  if (status === 'active') where.eliminado_el = null;
  else if (status === 'deleted') where.eliminado_el = { not: null };

  if (search) {
    where.OR = [
      { slug: { contains: search, mode: 'insensitive' } },
      { descripcion: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [totalItems, data] = await Promise.all([
    prisma.app_permisos.count({ where }),
    prisma.app_permisos.findMany({
      where,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { creado_el: 'desc' },
      select: {
        id: true,
        slug: true,
        descripcion: true,
        creado_el: true,
        actualizado_el: true,
        eliminado_el: true,
      },
    }),
  ]);

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

  const formattedData = data.map((permiso) => ({
    ...permiso,
    creado_el: permiso.creado_el ? dateVzla.format(permiso.creado_el) : null,
    actualizado_el: permiso.actualizado_el
      ? dateVzla.format(permiso.actualizado_el)
      : null,
    eliminado_el: permiso.eliminado_el
      ? dateVzla.format(permiso.eliminado_el)
      : null,
  }));

  return {
    data: formattedData,
    metadata: {
      totalItems,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalItems / parseInt(limit)),
    },
  };
};
