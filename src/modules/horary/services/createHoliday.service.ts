import { transactionToCreateHoliday } from '../models/index.js';
import type { HolidayInRequestBody } from '../types/index.js';

export const createHolidayService = async (holiday: HolidayInRequestBody) => {
  return await transactionToCreateHoliday(holiday);
};
