import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { LocationFilters } from '../types/index.js';

export const getLocations = async (filters: LocationFilters) => {
  const where: Prisma.ubicacionesWhereInput = {};

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
    prisma.ubicaciones.count({ where }),
    prisma.ubicaciones.findMany({
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

  const formattedData = data.map((location) => ({
    ...location,
    creado_el: location.creado_el ? dateVzla.format(location.creado_el) : null,
    actualizado_el: location.actualizado_el
      ? dateVzla.format(location.actualizado_el)
      : null,
    eliminado_el: location.eliminado_el
      ? dateVzla.format(location.eliminado_el)
      : null,
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
