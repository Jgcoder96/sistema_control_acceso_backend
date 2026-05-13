import { getUserRolesByID } from '../models/index.js';

export const getUserRolesByIDService = async (id: string) => {
  return await getUserRolesByID(id);
};
