import { CardAlreadyExists } from '../errors/index.js';
import { prisma } from '../../../config/index.js';
import type { AccessCardInRequestBody } from '../types/index.js';

export const transactionTocreateCard = async (
  data: AccessCardInRequestBody,
) => {
  return await prisma.$transaction(async (tx) => {
    const existingCard = await tx.tarjetas.findUnique({
      where: {
        codigo: data.codigo,
      },
    });

    if (existingCard) throw new CardAlreadyExists();

    return await tx.tarjetas.create({
      data: data,
    });
  });
};
