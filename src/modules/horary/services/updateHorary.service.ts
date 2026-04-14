import type { HoraryInRequestBody } from '../types/index.js';
import { transactionToUpdateHorary } from '../models/index.js';

export const updateHoraryService = async (
  horaryID: string,
  horary: HoraryInRequestBody,
) => {
  return await transactionToUpdateHorary(horaryID, horary);
};
