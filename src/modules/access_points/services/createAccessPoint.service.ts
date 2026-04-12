import { transactionToCreateAccessPoint } from '../models/index.js';
import type { AccessPointToCreate } from '../types/index.js';

export const createAccessPointService = async (
  accessPoint: AccessPointToCreate,
) => {
  accessPoint.mac = accessPoint.mac.toUpperCase();

  return await transactionToCreateAccessPoint(accessPoint);
};
