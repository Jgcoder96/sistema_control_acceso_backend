import { transactionToDeleteLocation } from '../models/index.js';

export const deleteLocationService = async (id: string) => {
  return await transactionToDeleteLocation(id);
};
