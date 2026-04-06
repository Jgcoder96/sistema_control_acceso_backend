import { prisma } from '../../../config/index.js';
import {
  CardWithoutUser,
  CardIsAlreadyDeleted,
  CardDoesNotExist,
} from '../errors/index.js';

export const transactionToDeleteCard = async (cardID: string) => {
  return await prisma.$transaction(async (tx) => {
    const card = await tx.tarjetas.findUnique({
      where: { id: cardID },
    });

    if (!card) throw new CardDoesNotExist();

    if (card.estado === 'eliminada') throw new CardIsAlreadyDeleted();

    if (card.usuario_id === null) throw new CardWithoutUser();

    const updatedCard = await tx.tarjetas.update({
      where: { id: card.id },
      data: {
        estado: 'eliminada',
        eliminado_el: new Date(),
        usuario_id: null,
      },
    });

    await tx.historial_asignaciones.create({
      data: {
        tarjeta_id: card.id,
        usuario_id: card.usuario_id,
        accion: 'eliminacion',
      },
    });

    return updatedCard;
  });
};
