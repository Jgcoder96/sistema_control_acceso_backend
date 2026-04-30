import { transactionToUpdateLocation } from '../models/index.js';
import type { LocationBodyRequest } from '../types/index.js';

export const updateLocationService = async (
  id: string,
  location: LocationBodyRequest,
) => {
  const locationName = location.nombre.trim();

  return await transactionToUpdateLocation(id, locationName);
};
