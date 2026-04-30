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

  const [totalItems, data] = await Promise.all([
    prisma.ubicaciones.count({ where }),
    prisma.ubicaciones.findMany({
      where,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { creado_el: 'desc' },
    }),
  ]);

  return {
    data,
    metadata: {
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / parseInt(limit)),
    },
  };
};
