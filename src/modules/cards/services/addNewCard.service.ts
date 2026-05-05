import { transactionTocreateCard } from '../models/index.js';
import type { AccessCardInRequestBody } from '../types/index.js';

export const addNewCardService = async (data: AccessCardInRequestBody) => {
  return await transactionTocreateCard(data);
};
