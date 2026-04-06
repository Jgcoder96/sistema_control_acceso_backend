import { prisma } from '../../../config/index.js';
import type { CardToCreate } from '../types/index.js';

export const createCard = async (data: CardToCreate) => {
  return await prisma.tarjetas.create({
    data: data,
  });
};
