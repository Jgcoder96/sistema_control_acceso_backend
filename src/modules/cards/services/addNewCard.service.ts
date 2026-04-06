import { createCard } from '../models/index.js';
import type { CardToCreate } from '../types/index.js';

export const addNewCardService = async (data: CardToCreate) => {
  const card = await createCard(data);
  return {
    id: card.id,
    codigo: card.codigo,
  };
};
