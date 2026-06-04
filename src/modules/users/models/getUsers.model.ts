import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { UserFilters } from '../types/index.js';

export const getUsers = async (filters: UserFilters) => {
  const where: Prisma.usuariosWhereInput = {};

  const { status, search, page, limit } = filters;

  if (status === 'active') where.eliminado_el = null;
  else if (status === 'deleted') where.eliminado_el = { not: null };

  if (search) {
    where.cedula = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [totalItems, data] = await Promise.all([
    prisma.usuarios.count({ where }),
    prisma.usuarios.findMany({
      where,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { creado_el: 'desc' },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cedula: true,
        correo_electronico: true,
        foto_url: true,
        estado: true,
        creado_el: true,
        actualizado_el: true,
        eliminado_el: true,
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
