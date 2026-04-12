import { transactionToUpdateAccessPoint } from '../models/index.js';
import type { AccessPointToUpdate } from '../types/index.js';

export const updateAccessPointService = async (
  id: string,
  accessPoint: AccessPointToUpdate,
) => {
  return await transactionToUpdateAccessPoint(id, accessPoint);
};
