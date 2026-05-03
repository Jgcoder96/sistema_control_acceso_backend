import { transactionToCreateSchedule } from '../models/index.js';
import type { ScheduleInRequestBody } from '../types/index.js';

export const createScheduleService = async (
  schedule: ScheduleInRequestBody,
) => {
  schedule.nombre = schedule.nombre.trim();
  return await transactionToCreateSchedule(schedule);
};
