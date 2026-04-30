import { transactionToCreateAccessPoint } from '../models/index.js';
import type { AccessPoint } from '../types/index.js';

export const createAccessPointService = async (accessPoint: AccessPoint) => {
  accessPoint.mac = accessPoint.mac.toUpperCase();
  accessPoint.mac = accessPoint.mac.trim();
  accessPoint.nombre = accessPoint.nombre.trim();

  return await transactionToCreateAccessPoint(accessPoint);
};
