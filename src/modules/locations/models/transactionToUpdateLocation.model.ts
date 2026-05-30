import {
  LocationAlreadyExists,
  LocationDoesNotExists,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import type { LocationBodyRequest } from '../types/index.js';

export const transactionToUpdateLocation = async (
  id: string,
  location: LocationBodyRequest,
) => {
  const { nombre, mesh_id } = location;

  return await prisma.$transaction(async (tx) => {
    const locationExists = await tx.ubicaciones.findFirst({
      where: { id, eliminado_el: null },
    });

    if (!locationExists) throw new LocationDoesNotExists();

    if (
      locationExists.nombre.toLowerCase() === nombre.toLowerCase() &&
      locationExists.mesh_id.toLowerCase() === mesh_id.toLowerCase()
    ) {
      return locationExists;
    }

    const conflict = await tx.ubicaciones.findFirst({
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
        id: { not: id },
        eliminado_el: null,
      },
    });

    if (conflict) throw new LocationAlreadyExists();

    const updatedLocation = await tx.ubicaciones.update({
      where: { id },
      data: {
        nombre: nombre,
        mesh_id: mesh_id,
      },
    });

    return updatedLocation;
  });
};
