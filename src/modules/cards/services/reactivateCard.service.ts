import { transactionToReactivateCard } from '../models/index.js';

export const reactivateCardService = async (cardID: string) => {
  await transactionToReactivateCard(cardID);
};
