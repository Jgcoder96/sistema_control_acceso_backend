import { prisma } from '../../../config/index.js';
import type { PhysicalPermitInRequestBody } from '../types/index.js';
import {
  AccessPointDoesNotExists,
  ExistingPermit,
  HoraryDoesNotExists,
  UserDoesNotExists,
} from '../errors/index.js';

export const transactionToCreatePhysicalPermit = async (
  physicalPermit: PhysicalPermitInRequestBody,
) => {
  const { usuario_id, punto_acceso_id, horario_id } = physicalPermit;

  return await prisma.$transaction(async (tx) => {
    const existingAccessPoint = await tx.puntos_acceso.findFirst({
      where: {
        id: punto_acceso_id,
      },
    });

    if (!existingAccessPoint) throw new AccessPointDoesNotExists();

    const existingUser = await tx.usuarios.findFirst({
      where: {
        id: usuario_id,
      },
    });

    if (!existingUser) throw new UserDoesNotExists();

    const existingHorary = await tx.horarios.findFirst({
      where: {
        id: horario_id,
      },
    });

    if (!existingHorary) throw new HoraryDoesNotExists();

    const existingPermit = await tx.permisos_fisicos.findFirst({
      where: {
        usuario_id,
        punto_acceso_id,
      },
    });

    if (existingPermit) {
      if (existingPermit.eliminado_el === null) throw new ExistingPermit();

      const permissionRestored = await tx.permisos_fisicos.update({
        where: { id: existingPermit.id },
        data: {
          horario_id,
          eliminado_el: null,
        },
      });

      return permissionRestored;
    }
    const newPhysicalPermit = await tx.permisos_fisicos.create({
      data: {
        usuario_id,
        punto_acceso_id,
        horario_id,
      },
    });
    return newPhysicalPermit;
  });
};
