import { CardDoesNotExist, CardWithoutUser } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToReturnCard = async (cardID: string) => {
  return await prisma.$transaction(async (tx) => {
    const card = await tx.tarjetas.findUnique({
      where: {
        id: cardID,
      },
    });

    if (!card) throw new CardDoesNotExist();

    if (card.usuario_id === null) throw new CardWithoutUser();

    const updatedCard = await tx.tarjetas.update({
      where: { id: card.id },
      data: {
        estado: 'activable',
        usuario_id: null,
        asignada_el: null,
      },
    });

    await tx.historial_asignaciones.create({
      data: {
        tarjeta_id: card.id,
        usuario_id: card.usuario_id,
        accion: 'devolucion',
      },
    });
    return updatedCard;
  });
};
