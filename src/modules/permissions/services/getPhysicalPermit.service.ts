import { getPhysicalPermits as getPhysicalPermitsModels } from '../models/index.js';
import type { PhysicalPermitFilters } from '../types/index.js';

export const getPhysicalPermitsService = async (
  filters: PhysicalPermitFilters,
) => {
  return await getPhysicalPermitsModels(filters);
};
