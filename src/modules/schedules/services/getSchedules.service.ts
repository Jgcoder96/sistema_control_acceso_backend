import type { ScheduleFilters } from '../types/index.js';
import { getSchedules as getScheduleModel } from '../models/index.js';

export const getSchedulesService = async (filters: ScheduleFilters) => {
  return getScheduleModel(filters);
};
