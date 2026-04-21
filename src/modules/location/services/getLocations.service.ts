import { getLocations as getLocationsModels } from '../models/index.js';
import type { LocationFilters } from '../types/index.js';

export const getLocationsService = async (filters: LocationFilters) => {
  return await getLocationsModels(filters);
};
