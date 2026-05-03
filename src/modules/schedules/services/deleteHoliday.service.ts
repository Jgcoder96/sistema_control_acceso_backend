import { transactionToDeleteHoliday } from '../models/index.js';

export const deleteHolidayService = async (holidayID: string) => {
  return await transactionToDeleteHoliday(holidayID);
};
