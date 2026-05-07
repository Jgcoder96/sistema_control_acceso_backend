import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { AppPermissionFilters } from '../types/index.js';

export const getAppPermissions = async (filters: AppPermissionFilters) => {
  const where: Prisma.app_permisosWhereInput = {};

  const { status, search, page, limit } = filters;

  if (status === 'active') where.eliminado_el = null;
  else if (status === 'deleted') where.eliminado_el = { not: null };

  if (search) {
    where.slug = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const take = parseInt(limit) || 10;
  const skip = (parseInt(page) - 1) * take;

  const [totalItems, data] = await Promise.all([
    prisma.app_permisos.count({ where }),
    prisma.app_permisos.findMany({
      where,
      take,
      skip,
      orderBy: { creado_el: 'desc' },
    }),
  ]);

  return {
    data,
    metadata: {
      totalItems,
      page: parseInt(page) || 1,
      limit: take,
      totalPages: Math.ceil(totalItems / take),
    },
  };
};
