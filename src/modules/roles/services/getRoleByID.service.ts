import { getRoleByID } from '../models/index.js';

export const getRoleByIDService = async (id: string) => {
  return await getRoleByID(id);
};
