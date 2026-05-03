import { getHolidays as getHolidaysModel } from '../models/index.js';
import type { HolidayFilters } from '../types/index.js';

export const getHolidaysService = async (filters: HolidayFilters) => {
  return getHolidaysModel(filters);
};
