import {
  AccessPointDoesNotExists,
  LocationDoesNotExists,
  MacAlreadyInUse,
  AccessPointNameAlreadyInUse,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import type { AccessPoint } from '../types/index.js';

export const transactionToUpdateAccessPoint = async (
  id: string,
  accessPoint: AccessPoint,
) => {
  return await prisma.$transaction(async (tx) => {
    const accessPointExists = await tx.puntos_acceso.findFirst({
      where: { id, eliminado_el: null },
    });

    if (!accessPointExists) throw new AccessPointDoesNotExists();

    const locationExists = await tx.ubicaciones.findFirst({
      where: { id: accessPoint.ubicacion_id, eliminado_el: null },
    });

    if (!locationExists) throw new LocationDoesNotExists();

    const normalizedMac = accessPoint.mac.toUpperCase();
    const macInUse = await tx.puntos_acceso.findFirst({
      where: {
        mac: normalizedMac,
        id: { not: id },
        eliminado_el: null,
      },
    });

    if (macInUse) throw new MacAlreadyInUse();

    const nameInUseInLocation = await tx.puntos_acceso.findFirst({
      where: {
        nombre: {
          equals: accessPoint.nombre,
          mode: 'insensitive',
        },
        ubicacion_id: accessPoint.ubicacion_id,
        id: { not: id },
        eliminado_el: null,
      },
    });

    if (nameInUseInLocation) throw new AccessPointNameAlreadyInUse();

    const updateAccessPoint = await tx.puntos_acceso.update({
      where: { id },
      data: {
        nombre: accessPoint.nombre,
        mac: normalizedMac,
        ubicaciones: {
          connect: { id: accessPoint.ubicacion_id },
        },
      },
    });

    return updateAccessPoint;
  });
};
