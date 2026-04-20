import { transactionToCreatePhysicalPermit } from '../models/index.js';
import type { PhysicalPermitInRequestBody } from '../types/index.js';

export const createPhysicalPermitService = async (
  physicalPermit: PhysicalPermitInRequestBody,
) => {
  return await transactionToCreatePhysicalPermit(physicalPermit);
};
