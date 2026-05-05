import { getCards as getCardsModels } from '../models/index.js';
import type { AccessCardFilters } from '../types/index.js';

export const getCardsService = async (filters: AccessCardFilters) => {
  return await getCardsModels(filters);
};
