import { transactionToDeleteHorary } from '../models/index.js';

export const deleteHoraryService = async (horaryID: string) => {
  return await transactionToDeleteHorary(horaryID);
};
