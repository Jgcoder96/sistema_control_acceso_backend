import { transactionToReportLostCard } from '../models/index.js';

export const reportLostCardService = async (cardID: string) => {
  await transactionToReportLostCard(cardID);
};
