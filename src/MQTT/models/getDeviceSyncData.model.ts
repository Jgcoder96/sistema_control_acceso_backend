import { Prisma } from '@prisma/client';
import { prisma } from '../../config/index.js';

export const getCompleteDeviceData = async (deviceMac: string) => {
  return await prisma.puntos_acceso.findUnique({
    where: { mac: deviceMac },
    include: {
      ubicaciones: {
        select: { mesh_id: true },
      },
      permisos_fisicos: {
        where: { eliminado_el: null },
        include: {
          usuarios: {
            include: {
              tarjetas: {
                where: { estado: 'activa', eliminado_el: null },
              },
            },
          },
          horarios: {
            include: { horario_detalles: true },
          },
        },
      },
    },
  });
};

export const getFestivos = async () => {
  return await prisma.festivos.findMany({
    where: { eliminado_el: null },
    select: {
      dia: true,
      mes: true,
      anio: true,
    },
  });
};

export type CompleteDeviceData = Prisma.PromiseReturnType<
  typeof getCompleteDeviceData
>;

export type FestivosData = Prisma.PromiseReturnType<typeof getFestivos>;
