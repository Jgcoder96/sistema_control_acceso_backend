import { transactionToDeleteCard } from '../models/index.js';

export const deleteCardService = async (cardID: string) => {
  await transactionToDeleteCard(cardID);
};
