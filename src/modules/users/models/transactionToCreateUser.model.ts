import { prisma } from '../../../config/index.js';
import { UserAlreadyExist } from '../errors/index.js';
import type { UserToCreate } from '../types/index.js';

export const transactionToCreateUser = async (data: UserToCreate) => {
  const { nombre, apellido, cedula, correo_electronico, clave_hash, foto_url } =
    data;

  return await prisma.$transaction(async (tx) => {
    const user = await tx.usuarios.findFirst({
      where: {
        OR: [
          { cedula: cedula },
          {
            correo_electronico: {
              equals: correo_electronico,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        eliminado_el: 'asc',
      },
    });

    if (user) {
      if (user.eliminado_el === null) throw new UserAlreadyExist();

      const restoredUser = await tx.usuarios.update({
        where: { id: user.id },
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

      return restoredUser;
    }

    const newUser = await tx.usuarios.create({
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

    return newUser;
  });
};
