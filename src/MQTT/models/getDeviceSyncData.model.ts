import { Prisma } from '@prisma/client';
import { prisma } from '../../config/index.js';

export const getDeviceInfo = async (deviceMac: string) => {
  return await prisma.puntos_acceso.findUnique({
    where: {
      mac: deviceMac,
    },
    select: {
      id: true,
      mac: true,
      version: true,
      eliminado_el: true,
      ubicaciones: {
        select: {
          mesh_id: true,
          eliminado_el: true,
        },
      },
    },
  });
};

export const getPaginatedCards = async (
  deviceMac: string,
  skip: number,
  take: number,
) => {
  return await prisma.tarjetas.findMany({
    where: {
      estado: 'activa',
      eliminado_el: null,
      usuarios: {
        eliminado_el: null,
        permisos_fisicos: {
          some: {
            eliminado_el: null,
            puntos_acceso: {
              mac: deviceMac,
              eliminado_el: null,
              ubicaciones: { eliminado_el: null },
            },
          },
        },
      },
    },
    skip: skip,
    take: take,
    include: {
      usuarios: {
        include: {
          permisos_fisicos: {
            where: {
              puntos_acceso: { mac: deviceMac },
              eliminado_el: null,
            },
            include: {
              horarios: {
                include: { horario_detalles: true },
              },
            },
          },
        },
      },
    },
  });
};

export const countTotalCards = async (deviceMac: string) => {
  return await prisma.tarjetas.count({
    where: {
      estado: 'activa',
      eliminado_el: null,
      usuarios: {
        eliminado_el: null,
        permisos_fisicos: {
          some: {
            eliminado_el: null,
            puntos_acceso: {
              mac: deviceMac,
              eliminado_el: null,
              ubicaciones: { eliminado_el: null },
            },
          },
        },
      },
    },
  });
};

export const getHolidays = async () => {
  return await prisma.festivos.findMany({
    where: { eliminado_el: null },
    select: {
      dia: true,
      mes: true,
      anio: true,
    },
  });
};

export type DeviceInfo = Prisma.PromiseReturnType<typeof getDeviceInfo>;
export type PaginatedCards = Prisma.PromiseReturnType<typeof getPaginatedCards>;
export type HolidaysData = Prisma.PromiseReturnType<typeof getHolidays>;
