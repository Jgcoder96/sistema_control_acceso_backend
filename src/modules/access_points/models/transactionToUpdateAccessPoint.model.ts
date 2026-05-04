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

    const normalizedMac = accessPoint.mac.toUpperCase();

    const isSameData =
      accessPointExists.nombre === accessPoint.nombre &&
      accessPointExists.mac === normalizedMac &&
      accessPointExists.ubicacion_id === accessPoint.ubicacion_id;

    if (isSameData) {
      return accessPointExists;
    }

    const locationExists = await tx.ubicaciones.findFirst({
      where: { id: accessPoint.ubicacion_id, eliminado_el: null },
    });

    if (!locationExists) throw new LocationDoesNotExists();

    if (accessPointExists.mac !== normalizedMac) {
      const macInUse = await tx.puntos_acceso.findFirst({
        where: {
          mac: normalizedMac,
          id: { not: id },
          eliminado_el: null,
        },
      });
      if (macInUse) throw new MacAlreadyInUse();
    }

    if (
      accessPointExists.nombre !== accessPoint.nombre ||
      accessPointExists.ubicacion_id !== accessPoint.ubicacion_id
    ) {
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
    }

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
