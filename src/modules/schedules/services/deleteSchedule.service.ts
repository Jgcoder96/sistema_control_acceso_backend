import { transactionToDeleteSchedule } from '../models/index.js';

export const deleteScheduleService = async (scheduleID: string) => {
  return await transactionToDeleteSchedule(scheduleID);
};
