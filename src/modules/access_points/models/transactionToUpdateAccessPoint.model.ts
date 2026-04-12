import {
  AccessPointDoesNotExists,
  LocationDoesNotExists,
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

    if (accessPoint.nombre) dataUpdate.nombre = accessPoint.nombre;

    if (accessPoint.mac) dataUpdate.mac = accessPoint.mac.toUpperCase();

    if (accessPoint.ubicacion_id) {
      const ubicacionExiste = await tx.ubicaciones.findFirst({
        where: { id: accessPoint.ubicacion_id, eliminado_el: null },
      });
      if (!ubicacionExiste) throw new LocationDoesNotExists();

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
