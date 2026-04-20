import { transactionToDeletePhysicalPermit } from '../models/index.js';

export const deletePhysicalPermitService = async (physicalPermitID: string) => {
  return await transactionToDeletePhysicalPermit(physicalPermitID);
};
