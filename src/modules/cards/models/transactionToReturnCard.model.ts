import {
  CardDoesNotExists,
  CardWithoutUser,
  InvalidStatusToReturnCard,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToReturnCard = async (cardID: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Buscar la tarjeta y validar existencia
    const card = await tx.tarjetas.findUnique({
      where: {
        id: cardID,
      },
    });

    if (!card) throw new CardDoesNotExists();

    const statesAllowedForReturn = ['activa', 'bloqueada'];
    if (!statesAllowedForReturn.includes(card.estado)) {
      throw new InvalidStatusToReturnCard();
    }

    if (card.usuario_id === null) throw new CardWithoutUser();

    const currentUserId = card.usuario_id;

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
        usuario_id: currentUserId,
        accion: 'devolucion',
      },
    });

    await tx.puntos_acceso.updateMany({
      where: {
        permisos_fisicos: {
          some: {
            usuario_id: currentUserId,
            eliminado_el: null,
          },
        },
      },
      data: {
        version: {
          increment: 1,
        },
        esta_sincronizado: false,
      },
    });

    return updatedCard;
  });
};
