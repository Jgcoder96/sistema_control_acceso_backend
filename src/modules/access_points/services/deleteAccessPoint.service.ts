import { transactionToDeleteAccessPoint } from '../models/index.js';

export const deleteAccessPointService = async (id: string) => {
  return await transactionToDeleteAccessPoint(id);
};
