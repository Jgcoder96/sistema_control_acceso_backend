import { prisma } from '../../../config/index.js';

export const getRefreshTokenRecord = async (token: string) => {
  return await prisma.tokens_refresco.findUnique({
    where: {
      token: token,
    },
    include: {
      usuarios: true,
    },
  });
};
