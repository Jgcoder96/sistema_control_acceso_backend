import { transactionToCreateHorary } from '../models/index.js';
import type { HoraryInRequestBody } from '../types/index.js';

export const createHoraryService = async (horary: HoraryInRequestBody) => {
  return await transactionToCreateHorary(horary);
};
