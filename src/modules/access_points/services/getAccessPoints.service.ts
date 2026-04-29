import type { AccessPointFilters } from '../types/index.js';
import { getAccessPoints as getAccessPointsModels } from '../models/index.js';

export const getAccessPointsService = async (filters: AccessPointFilters) => {
  return getAccessPointsModels(filters);
};
