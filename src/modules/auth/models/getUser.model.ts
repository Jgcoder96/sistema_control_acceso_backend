import { prisma } from '../../../adapters/prisma.adapters.js';

export const getUser = async () => {
  const user = await prisma.usuarios.findFirst();

  return user;
};
