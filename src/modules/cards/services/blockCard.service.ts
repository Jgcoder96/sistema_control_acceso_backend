import { transactionToBlockCard } from '../models/index.js';

export const blockCardService = async (cardID: string) => {
  return await transactionToBlockCard(cardID);
};
