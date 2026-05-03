import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { HolidayFilters } from '../types/index.js';

export const getHolidays = async (filters: HolidayFilters) => {
  const where: Prisma.festivosWhereInput = {};

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
    prisma.festivos.count({ where }),
    prisma.festivos.findMany({
      where,
      take,
      skip,
      orderBy: [
        { anio: 'desc' },
        { mes: 'desc' },
        { dia: 'desc' },
        { creado_el: 'desc' },
      ],
    }),
  ]);

  return {
    data,
    metadata: {
      totalItems,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(totalItems / take),
    },
  };
};
