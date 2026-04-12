import {
  AccessPointAlreadyExists,
  LocationDoesNotExists,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import type { AccessPointToCreate } from '../types/index.js';

export const transactionToCreateAccessPoint = async (
  accessPoint: AccessPointToCreate,
) => {
  return await prisma.$transaction(async (tx) => {
    const location = await tx.ubicaciones.findFirst({
      where: { id: accessPoint.ubicacion_id, eliminado_el: null },
    });

    if (!location) throw new LocationDoesNotExists();

    const accessPointExist = await tx.puntos_acceso.findFirst({
      where: { mac: accessPoint.mac },
    });

    if (accessPointExist) {
      if (accessPointExist.eliminado_el === null)
        throw new AccessPointAlreadyExists();

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
        mac: accessPoint.mac,
        ubicacion_id: accessPoint.ubicacion_id,
      },
    });

    return newAccessPoint;
  });
};
