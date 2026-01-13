import { prisma } from '../../../config/prismaConnection.config.js';
import type { UserToCreate } from '../types/UserToCreate.type.js';
import type { usuarios } from '@prisma/client';

export const createUser = async (user: UserToCreate): Promise<usuarios> => {
  return await prisma.usuarios.create({
    data: user,
  });
};
