import { prisma } from '../../../config/index.js';

export const deleteRefreshToken = async (token: string): Promise<void> => {
  await prisma.tokens_refresco.deleteMany({
    where: {
      token: token,
    },
  });
};
