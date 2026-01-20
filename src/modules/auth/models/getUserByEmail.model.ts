import { prisma } from '../../../config/prismaConnection.config.js';
import type { usuarios } from '@prisma/client';

export const getUserByEmail = async (
  email: string,
): Promise<usuarios | null> => {
  return await prisma.usuarios.findUnique({
    where: {
      correo_electronico: email,
    },
  });
};
