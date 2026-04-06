import { transactionToReturnCard } from '../models/index.js';

export const returnCardService = async (cardID: string) => {
  await transactionToReturnCard(cardID);
};
