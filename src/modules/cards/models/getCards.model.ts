import { prisma } from '../../../config/index.js';
import { Prisma, estado_tarjeta } from '@prisma/client';
import type { AccessCardFilters } from '../types/index.js';

export const getCards = async (filters: AccessCardFilters) => {
  const { status, cedula, codigo, page, limit } = filters;
  const where: Prisma.tarjetasWhereInput = {};

  if (status && status !== 'all') {
    where.estado = status as estado_tarjeta;
  }

  if (codigo) {
    where.codigo = { contains: codigo, mode: 'insensitive' };
  }

  if (cedula) {
    where.usuarios = {
      cedula: { contains: cedula, mode: 'insensitive' },
    };
  }

  const take = Math.max(1, parseInt(limit) || 10);
  const skip = (Math.max(1, parseInt(page) || 1) - 1) * take;

  const [totalItems, rawData] = await Promise.all([
    prisma.tarjetas.count({ where }),
    prisma.tarjetas.findMany({
      where,
      take,
      skip,
      select: {
        id: true,
        codigo: true,
        estado: true,
        creado_el: true,
        actualizado_el: true,
        eliminado_el: true,
        asignada_el: true,
        usuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            cedula: true,
          },
        },
        historial_asignaciones: {
          orderBy: { fecha: 'desc' },
          select: {
            id: true,
            accion: true,
            fecha: true,
            usuarios: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                cedula: true,
              },
            },
          },
        },
      },
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

  const data = rawData.map((item) => {
    const { usuarios, historial_asignaciones, ...cardRest } = item;

    return {
      ...cardRest,
      creado_el: cardRest.creado_el
        ? dateVzla.format(cardRest.creado_el)
        : null,
      actualizado_el: cardRest.actualizado_el
        ? dateVzla.format(cardRest.actualizado_el)
        : null,
      eliminado_el: cardRest.eliminado_el
        ? dateVzla.format(cardRest.eliminado_el)
        : null,
      asignada_el: cardRest.asignada_el
        ? dateVzla.format(cardRest.asignada_el)
        : null,

      usuario: usuarios,

      historial_asignaciones: historial_asignaciones.map((h) => {
        const { usuarios: hUsuario, ...hRest } = h;
        return {
          ...hRest,
          fecha: hRest.fecha ? dateVzla.format(hRest.fecha) : null,
          usuario: hUsuario,
        };
      }),
    };
  });

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
