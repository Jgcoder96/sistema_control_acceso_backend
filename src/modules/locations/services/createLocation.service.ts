import { transactionToCreateLocation } from '../models/index.js';
import type { LocationBodyRequest } from '../types/index.js';

export const createLocationService = async (location: LocationBodyRequest) => {
  location.nombre = location.nombre.trim();
  location.mesh_id = location.mesh_id.trim();

  return await transactionToCreateLocation(location);
};
