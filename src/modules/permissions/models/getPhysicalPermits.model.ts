import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { PhysicalPermitFilters } from '../types/index.js';

export const getPhysicalPermits = async (filters: PhysicalPermitFilters) => {
  const where: Prisma.permisos_fisicosWhereInput = {};

  const { status, page, limit, cedula, puntoAcceso, ubicacion } = filters;

  const pLimit = parseInt(limit) || 10;
  const pPage = parseInt(page) || 1;

  if (status === 'active') where.eliminado_el = null;
  else if (status === 'deleted') where.eliminado_el = { not: null };

  if (cedula) {
    where.usuarios = {
      cedula: { contains: cedula, mode: 'insensitive' },
    };
  }

  if (puntoAcceso || ubicacion) {
    where.puntos_acceso = {
      ...(puntoAcceso && {
        nombre: { contains: puntoAcceso, mode: 'insensitive' },
      }),

      ...(ubicacion && {
        ubicaciones: {
          nombre: { contains: ubicacion, mode: 'insensitive' },
        },
      }),
    };
  }

  const [totalItems, data] = await Promise.all([
    prisma.permisos_fisicos.count({ where }),
    prisma.permisos_fisicos.findMany({
      where,
      include: {
        usuarios: {
          select: {
            nombre: true,
            apellido: true,
            cedula: true,
          },
        },
        puntos_acceso: {
          include: {
            ubicaciones: {
              select: { nombre: true },
            },
          },
        },
        horarios: {
          select: { nombre: true },
        },
      },
      take: pLimit,
      skip: (pPage - 1) * pLimit,
      orderBy: { creado_el: 'desc' },
    }),
  ]);

  const formattedData = data.map((item) => ({
    id: item.id,
    usuario: `${item.usuarios.nombre} ${item.usuarios.apellido}`,
    cedula: item.usuarios.cedula,
    punto_acceso: item.puntos_acceso.nombre,
    ubicacion: item.puntos_acceso.ubicaciones?.nombre,
    horario: item.horarios?.nombre,
    creado_el: item.creado_el,
    eliminado_el: item.eliminado_el,
  }));

  return {
    data: formattedData,
    metadata: {
      totalItems,
      page: pPage,
      limit: pLimit,
      totalPages: Math.ceil(totalItems / pLimit),
    },
  };
};
