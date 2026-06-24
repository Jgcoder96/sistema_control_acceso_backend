import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { AccessPointFilters } from '../types/index.js';

export const getAccessPoints = async (filters: AccessPointFilters) => {
  const where: Prisma.puntos_accesoWhereInput = {};

  const { status, search, page, limit, locationId } = filters;

  if (locationId) {
    where.ubicacion_id = locationId;
  }

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

  const formattedData = data.map((item) => {
    return {
      id: item.id,
      nombre: item.nombre,
      mac: item.mac,
      creado_el: item.creado_el ? dateVzla.format(item.creado_el) : null,
      actualizado_el: item.actualizado_el
        ? dateVzla.format(item.actualizado_el)
        : null,
      eliminado_el: item.eliminado_el
        ? dateVzla.format(item.eliminado_el)
        : null,
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
      limit: take,
      totalPages: Math.ceil(totalItems / take),
    },
  };
};
