import { transactionToBlockCard } from '../models/index.js';

export const blockCardService = async (cardID: string) => {
  await transactionToBlockCard(cardID);
};
