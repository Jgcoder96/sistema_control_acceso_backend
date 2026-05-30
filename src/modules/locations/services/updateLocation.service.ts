import { transactionToUpdateLocation } from '../models/index.js';
import type { LocationBodyRequest } from '../types/index.js';

export const updateLocationService = async (
  id: string,
  location: LocationBodyRequest,
) => {
  location.nombre = location.nombre.trim();
  location.mesh_id = location.mesh_id.trim();

  return await transactionToUpdateLocation(id, location);
};
