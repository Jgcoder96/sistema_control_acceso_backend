import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { RoleFilters } from '../types/index.js';

export const getRoles = async (filters: RoleFilters) => {
  const where: Prisma.rolesWhereInput = {};

  const { status, search, page, limit } = filters;

  if (status === 'active') where.eliminado_el = null;
  else if (status === 'deleted') where.eliminado_el = { not: null };

  if (search) {
    where.nombre = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  const [totalItems, data] = await Promise.all([
    prisma.roles.count({ where }),
    prisma.roles.findMany({
      where,
      take,
      skip,
      orderBy: { creado_el: 'desc' },
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

  const formattedData = data.map((role) => ({
    ...role,
    creado_el: role.creado_el ? dateVzla.format(role.creado_el) : null,
    actualizado_el: role.actualizado_el
      ? dateVzla.format(role.actualizado_el)
      : null,
    eliminado_el: role.eliminado_el ? dateVzla.format(role.eliminado_el) : null,
  }));

  return {
    data: formattedData,
    metadata: {
      totalItems,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(totalItems / take),
    },
  };
};
