import {
  UserDoesNotExist,
  UserEmailAlreadyExist,
  UserIDAlreadyExist,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import { Prisma, type usuarios } from '@prisma/client';
import type { UserToUpdate } from '../types/index.js';

export const transactionToUpdateUser = async (
  id: string,
  data: UserToUpdate,
): Promise<usuarios> => {
  const {
    nombre,
    apellido,
    cedula,
    correo_electronico,
    estado,
    foto_url,
    clave_hash,
  } = data;

  return await prisma.$transaction(async (tx) => {
    const currentUser = await tx.usuarios.findFirst({
      where: {
        id,
        eliminado_el: null,
      },
    });

    if (!currentUser) throw new UserDoesNotExist();

    if (currentUser.cedula !== cedula) {
      const cedulaExists = await tx.usuarios.findFirst({
        where: {
          cedula,
          id: { not: id },
        },
      });

      if (cedulaExists) throw new UserIDAlreadyExist();
    }

    if (
      currentUser.correo_electronico.toLowerCase() !==
      correo_electronico.toLowerCase()
    ) {
      const emailExists = await tx.usuarios.findFirst({
        where: {
          correo_electronico: {
            equals: correo_electronico,
            mode: 'insensitive',
          },
          id: { not: id },
        },
      });

      if (emailExists) throw new UserEmailAlreadyExist();
    }

    const updateData: Prisma.usuariosUpdateInput = {
      nombre,
      apellido,
      cedula,
      correo_electronico,
      estado,
    };

    if (foto_url !== undefined) updateData.foto_url = foto_url;

    if (clave_hash !== undefined) updateData.clave_hash = clave_hash;

    const updatedUser = await tx.usuarios.update({
      where: { id },
      data: updateData,
    });

    return updatedUser;
  });
};
