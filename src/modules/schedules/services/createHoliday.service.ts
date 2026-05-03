import { transactionToCreateHoliday } from '../models/index.js';
import type { HolidayInRequestBody } from '../types/index.js';

export const createHolidayService = async (holiday: HolidayInRequestBody) => {
  holiday.nombre = holiday.nombre.trim();
  return await transactionToCreateHoliday(holiday);
};
