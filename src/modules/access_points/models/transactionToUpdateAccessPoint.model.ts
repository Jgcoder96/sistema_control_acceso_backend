import {
  AccessPointDoesNotExists,
  LocationDoesNotExists,
  MacAlreadyInUse,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import { Prisma } from '@prisma/client';
import type { AccessPointToUpdate } from '../types/index.js';

export const transactionToUpdateAccessPoint = async (
  id: string,
  accessPoint: AccessPointToUpdate,
) => {
  return await prisma.$transaction(async (tx) => {
    const accessPointExists = await tx.puntos_acceso.findFirst({
      where: { id, eliminado_el: null },
    });

    if (!accessPointExists) throw new AccessPointDoesNotExists();

    const dataUpdate: Prisma.puntos_accesoUpdateInput = {};

    if (accessPoint.mac) {
      const normalizedMac = accessPoint.mac.toUpperCase();

      const macInUse = await tx.puntos_acceso.findFirst({
        where: {
          mac: normalizedMac,
          id: { not: id },
          eliminado_el: null,
        },
      });

      if (macInUse) throw new MacAlreadyInUse();
    }

    if (accessPoint.nombre) dataUpdate.nombre = accessPoint.nombre;
    if (accessPoint.mac) dataUpdate.mac = accessPoint.mac.toUpperCase();

    if (accessPoint.ubicacion_id) {
      const locationExists = await tx.ubicaciones.findFirst({
        where: { id: accessPoint.ubicacion_id, eliminado_el: null },
      });

      if (!locationExists) throw new LocationDoesNotExists();

      dataUpdate.ubicaciones = {
        connect: { id: accessPoint.ubicacion_id },
      };
    }

    const updateAccessPoint = await tx.puntos_acceso.update({
      where: { id },
      data: dataUpdate,
    });

    return updateAccessPoint;
  });
};
