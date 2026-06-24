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

  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  const [totalItems, data] = await Promise.all([
    prisma.horarios.count({ where }),
    prisma.horarios.findMany({
      where,
      take,
      skip,
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

  // 1. Formateador para fechas de AUDITORÍA (Con zona horaria de Venezuela)
  const dateVzla = new Intl.DateTimeFormat('es-VE', {
    timeZone: 'America/Caracas',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // 2. Formateador para HORAS de apertura/cierre (Usamos UTC para NO mover la hora)
  const timeFormatter = new Intl.DateTimeFormat('es-VE', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedData = data.map((schedule) => ({
    ...schedule,
    // Formatear fechas de auditoría
    creado_el: schedule.creado_el ? dateVzla.format(schedule.creado_el) : null,
    actualizado_el: schedule.actualizado_el
      ? dateVzla.format(schedule.actualizado_el)
      : null,
    eliminado_el: schedule.eliminado_el
      ? dateVzla.format(schedule.eliminado_el)
      : null,

    // Formatear detalles del horario
    horario_detalles: schedule.horario_detalles.map((detalle) => ({
      ...detalle,
      hora_inicio: detalle.hora_inicio
        ? timeFormatter.format(new Date(detalle.hora_inicio))
        : null,
      hora_fin: detalle.hora_fin
        ? timeFormatter.format(new Date(detalle.hora_fin))
        : null,
    })),
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
