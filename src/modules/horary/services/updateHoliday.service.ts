import type { HolidayInRequestBody } from '../types/index.js';
import { transactionToUpdateHoliday } from '../models/index.js';

export const updateHolidayService = async (
  holidayID: string,
  holiday: HolidayInRequestBody,
) => {
  return await transactionToUpdateHoliday(holidayID, holiday);
};
