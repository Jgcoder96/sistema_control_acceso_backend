import { prisma } from '../../../config/index.js';
import { UserIDAlreadyExist, UserEmailAlreadyExist } from '../errors/index.js';
import type { UserToCreate } from '../types/index.js';

export const transactionToCreateUser = async (data: UserToCreate) => {
  const { nombre, apellido, cedula, correo_electronico, clave_hash, foto_url } =
    data;

  return await prisma.$transaction(async (tx) => {
    const existingCedula = await tx.usuarios.findFirst({
      where: {
        cedula,
        eliminado_el: null,
      },
    });

    if (existingCedula) {
      throw new UserIDAlreadyExist();
    }

    const existingEmail = await tx.usuarios.findFirst({
      where: {
        correo_electronico: {
          equals: correo_electronico,
          mode: 'insensitive',
        },
        eliminado_el: null,
      },
    });

    if (existingEmail) {
      throw new UserEmailAlreadyExist();
    }

    const deletedUser = await tx.usuarios.findFirst({
      where: {
        OR: [
          { cedula },
          {
            correo_electronico: {
              equals: correo_electronico,
              mode: 'insensitive',
            },
          },
        ],
        NOT: {
          eliminado_el: null,
        },
      },
    });

    if (deletedUser) {
      return await tx.usuarios.update({
        where: { id: deletedUser.id },
        data: {
          nombre,
          apellido,
          cedula,
          correo_electronico,
          clave_hash,
          foto_url,
          estado: 'activo',
          eliminado_el: null,
        },
      });
    }

    return await tx.usuarios.create({
      data: {
        nombre,
        apellido,
        cedula,
        correo_electronico,
        clave_hash,
        foto_url,
        estado: 'activo',
      },
    });
  });
};
