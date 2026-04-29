import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { AccessPointFilters } from '../types/index.js';

export const getAccessPoints = async (filters: AccessPointFilters) => {
  const where: Prisma.puntos_accesoWhereInput = {
    ubicacion_id: filters.locationId,
  };

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
    prisma.puntos_acceso.count({ where }),
    prisma.puntos_acceso.findMany({
      where,
      include: {
        ubicaciones: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { creado_el: 'desc' },
    }),
  ]);

  const formattedData = data.map((item) => {
    return {
      id: item.id,
      nombre: item.nombre,
      mac: item.mac,
      creado_el: item.creado_el,
      actualizado_el: item.actualizado_el,
      eliminado_el: item.eliminado_el,
      ubicacion: {
        id: item.ubicaciones?.id,
        nombre: item.ubicaciones?.nombre,
      },
    };
  });

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
