import type { ScheduleInRequestBody } from '../types/index.js';
import { transactionToUpdateSchedule } from '../models/index.js';

export const updateScheduleService = async (
  scheduleID: string,
  schedule: ScheduleInRequestBody,
) => {
  schedule.nombre = schedule.nombre.trim();
  return await transactionToUpdateSchedule(scheduleID, schedule);
};
