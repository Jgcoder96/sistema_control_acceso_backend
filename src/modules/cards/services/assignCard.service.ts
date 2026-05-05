import { transactionToAssignCard } from '../models/index.js';

export const assignCardService = async (cardID: string, userID: string) => {
  return await transactionToAssignCard(cardID, userID);
};
