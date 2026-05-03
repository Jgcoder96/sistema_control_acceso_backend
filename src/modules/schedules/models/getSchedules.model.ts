import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { ScheduleFilters } from '../types/index.js';

export const getSchedules = async (filters: ScheduleFilters) => {
  const where: Prisma.horariosWhereInput = {};

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
    prisma.horarios.count({ where }),
    prisma.horarios.findMany({
      where,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { creado_el: 'desc' },
      include: {
        horario_detalles: {
          select: {
            id: true,
            dia_semana: true,
            es_festivo: true,
            hora_inicio: true,
            hora_fin: true,
          },
          orderBy: { dia_semana: 'asc' },
        },
      },
    }),
  ]);

  return {
    data,
    metadata: {
      totalItems,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalItems / parseInt(limit)),
    },
  };
};
