import {
  MacAlreadyInUse,
  LocationDoesNotExists,
  AccessPointNameAlreadyInUse,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import type { AccessPoint } from '../types/index.js';

export const transactionToCreateAccessPoint = async (
  accessPoint: AccessPoint,
) => {
  return await prisma.$transaction(async (tx) => {
    const location = await tx.ubicaciones.findFirst({
      where: { id: accessPoint.ubicacion_id, eliminado_el: null },
    });

    if (!location) throw new LocationDoesNotExists();

    const nameInUseInLocation = await tx.puntos_acceso.findFirst({
      where: {
        nombre: {
          equals: accessPoint.nombre,
          mode: 'insensitive',
        },
        ubicacion_id: accessPoint.ubicacion_id,
        eliminado_el: null,
      },
    });

    if (nameInUseInLocation) throw new AccessPointNameAlreadyInUse();

    const normalizedMac = accessPoint.mac.toUpperCase();

    const accessPointExist = await tx.puntos_acceso.findFirst({
      where: { mac: normalizedMac },
    });

    if (accessPointExist) {
      if (accessPointExist.eliminado_el === null) throw new MacAlreadyInUse();

      const accessPointUpdate = await tx.puntos_acceso.update({
        where: { id: accessPointExist.id },
        data: {
          nombre: accessPoint.nombre,
          ubicacion_id: accessPoint.ubicacion_id,
          eliminado_el: null,
        },
      });
      return accessPointUpdate;
    }

    const newAccessPoint = await tx.puntos_acceso.create({
      data: {
        nombre: accessPoint.nombre,
        mac: normalizedMac,
        ubicacion_id: accessPoint.ubicacion_id,
      },
    });

    return newAccessPoint;
  });
};
