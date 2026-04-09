import { transactionToCreateLocation } from '../models/index.js';
import type { LocationBodyRequest } from '../types/index.js';

export const createLocationService = async (location: LocationBodyRequest) => {
  const locationName = location.nombre.trim();

  return await transactionToCreateLocation(locationName);
};
