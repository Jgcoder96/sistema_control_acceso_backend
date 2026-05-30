import { LocationAlreadyExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import type { LocationBodyRequest } from '../types/index.js';

export const transactionToCreateLocation = async (
  locationData: LocationBodyRequest,
) => {
  const { nombre, mesh_id } = locationData;

  return await prisma.$transaction(async (tx) => {
    const location = await tx.ubicaciones.findFirst({
      where: {
        OR: [
          {
            nombre: {
              equals: nombre,
              mode: 'insensitive',
            },
          },
          {
            mesh_id: {
              equals: mesh_id,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    if (location) {
      if (location.eliminado_el === null) throw new LocationAlreadyExists();

      const restoredLocation = await tx.ubicaciones.update({
        where: { id: location.id },
        data: {
          nombre: locationData.nombre,
          mesh_id: mesh_id,
          eliminado_el: null,
          actualizado_el: new Date(),
        },
      });

      return restoredLocation;
    }

    const newLocation = await tx.ubicaciones.create({
      data: {
        nombre: nombre,
        mesh_id: mesh_id,
      },
    });

    return newLocation;
  });
};
