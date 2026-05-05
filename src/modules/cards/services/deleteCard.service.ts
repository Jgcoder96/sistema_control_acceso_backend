import { transactionToDeleteCard } from '../models/index.js';

export const deleteCardService = async (cardID: string) => {
  return await transactionToDeleteCard(cardID);
};
