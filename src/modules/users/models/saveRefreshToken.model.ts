import { prisma } from '../../../config/index.js';

export const saveRefreshToken = async (
  userId: string,
  refreshToken: string,
) => {
  await prisma.tokens_refresco.deleteMany({
    where: { usuario_id: userId },
  });

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);

  return await prisma.tokens_refresco.create({
    data: {
      usuario_id: userId,
      token: refreshToken,
      expira_el: expirationDate,
    },
  });
};
