import { prisma } from '../../../config/index.js';
import type { UserToCreate } from '../types/index.js';
import type { usuarios } from '@prisma/client';

export const createUser = async (user: UserToCreate): Promise<usuarios> => {
  return await prisma.usuarios.create({
    data: user,
  });
};
