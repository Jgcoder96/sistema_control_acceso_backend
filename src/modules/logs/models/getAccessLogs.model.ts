import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { AccessLogsFilters } from '../types/index.js';

export const getAccessLogs = async (filters: AccessLogsFilters) => {
  const { cedula, puntoDeAccesoId, tarjeta, ubicacionId, limit, page } =
    filters;

  const andConditions: Prisma.logs_accesoWhereInput[] = [];

  if (ubicacionId) {
    andConditions.push({
      puntos_acceso: { ubicacion_id: ubicacionId },
    });
  }

  if (puntoDeAccesoId) {
    andConditions.push({
      punto_acceso_id: puntoDeAccesoId,
    });
  }

  if (cedula) {
    andConditions.push({
      tarjetas: {
        usuarios: { cedula: { contains: cedula, mode: 'insensitive' } },
      },
    });
  }

  if (tarjeta) {
    const tarjetaSinCeros = tarjeta.replace(/^0+/, '');
    andConditions.push({
      OR: [
        { codigo_tarjeta: { contains: tarjeta, mode: 'insensitive' } },
        { codigo_tarjeta: { contains: tarjetaSinCeros, mode: 'insensitive' } },
      ],
    });
  }

  const where: Prisma.logs_accesoWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const take = Math.max(1, parseInt(limit) || 10);
  const skip = (Math.max(1, parseInt(page) || 1) - 1) * take;

  const [totalItems, rawData] = await Promise.all([
    prisma.logs_acceso.count({ where }),
    prisma.logs_acceso.findMany({
      where,
      take,
      skip,
      orderBy: { fecha: 'desc' },
      include: {
        puntos_acceso: {
          include: { ubicaciones: true },
        },
        tarjetas: {
          include: {
            usuarios: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                cedula: true,
                correo_electronico: true,
                foto_url: true,
              },
            },
          },
        },
      },
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

  const data = rawData.map((log) => {
    let tarjetaData = null;

    if (log.tarjetas) {
      tarjetaData = {
        id: log.tarjetas.id,
        codigo: log.tarjetas.codigo,
        usuario: log.tarjetas.usuarios
          ? {
              id: log.tarjetas.usuarios.id,
              nombre: log.tarjetas.usuarios.nombre,
              apellido: log.tarjetas.usuarios.apellido,
              cedula: log.tarjetas.usuarios.cedula,
              correo: log.tarjetas.usuarios.correo_electronico,
              foto: log.tarjetas.usuarios.foto_url,
            }
          : null,
      };
    }

    return {
      id: log.id,
      codigo_tarjeta_raw: log.codigo_tarjeta,
      fecha: log.fecha ? dateVzla.format(log.fecha) : null,
      autorizado: log.autorizado,

      tarjeta: tarjetaData,

      punto_acceso: {
        id: log.puntos_acceso.id,
        nombre: log.puntos_acceso.nombre,
        mac: log.puntos_acceso.mac,
      },

      ubicacion: {
        id: log.puntos_acceso.ubicaciones.id,
        mesh_id: log.puntos_acceso.ubicaciones.mesh_id,
        nombre: log.puntos_acceso.ubicaciones.nombre,
      },
    };
  });

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
