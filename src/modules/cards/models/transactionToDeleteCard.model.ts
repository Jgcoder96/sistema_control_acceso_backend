import { prisma } from '../../../config/index.js';
import {
  CardIsAlreadyDeleted,
  CardDoesNotExists,
  CardIsActive,
} from '../errors/index.js';

export const transactionToDeleteCard = async (cardID: string) => {
  return await prisma.$transaction(async (tx) => {
    const card = await tx.tarjetas.findUnique({
      where: { id: cardID },
    });

    if (!card) throw new CardDoesNotExists();

    if (card.estado === 'eliminada') throw new CardIsAlreadyDeleted();

    if (card.estado === 'activa') throw new CardIsActive();

    const deletedCard = await tx.tarjetas.update({
      where: { id: card.id },
      data: {
        estado: 'eliminada',
        eliminado_el: new Date(),
        usuario_id: null,
      },
    });

    if (card.usuario_id) {
      await tx.historial_asignaciones.create({
        data: {
          tarjeta_id: card.id,
          usuario_id: card.usuario_id,
          accion: 'eliminacion',
        },
      });
    }

    return deletedCard;
  });
};
