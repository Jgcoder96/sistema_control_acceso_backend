import {
  CardDoesNotExists,
  CardIsNotActive,
  CardWithoutUser,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToBlockCard = async (cardID: string) => {
  return await prisma.$transaction(async (tx) => {
    const card = await tx.tarjetas.findUnique({
      where: {
        id: cardID,
      },
    });

    if (!card) throw new CardDoesNotExists();

    if (card.estado !== 'activa') throw new CardIsNotActive();

    if (card.usuario_id === null) throw new CardWithoutUser();

    const updatedCard = await tx.tarjetas.update({
      where: { id: card.id },
      data: { estado: 'bloqueada' },
    });

    await tx.historial_asignaciones.create({
      data: {
        tarjeta_id: card.id,
        usuario_id: card.usuario_id,
        accion: 'bloqueo',
      },
    });
    return updatedCard;
  });
};
