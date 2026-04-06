import { transactionToAssignCard } from '../models/index.js';

export const assignCardService = async (cardID: string, userID: string) => {
  await transactionToAssignCard(cardID, userID);
};
