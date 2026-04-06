import {
  CardDoesNotExist,
  CardIsNotAssignable,
  UserDoesNotExist,
} from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToAssignCard = async (
  cardID: string,
  userID: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.usuarios.findUnique({
      where: { id: userID },
    });

    if (!user) throw new UserDoesNotExist();

    const card = await tx.tarjetas.findUnique({
      where: { id: cardID },
    });

    if (!card) throw new CardDoesNotExist();

    if (card.estado !== 'activable') throw new CardIsNotAssignable();

    const updatedCard = await tx.tarjetas.update({
      where: { id: card.id, estado: 'activable' },
      data: {
        usuario_id: user.id,
        estado: 'activa',
        asignada_el: new Date(),
      },
    });

    await tx.historial_asignaciones.create({
      data: {
        tarjeta_id: card.id,
        usuario_id: user.id,
        accion: 'asignacion',
      },
    });

    return updatedCard;
  });
};
