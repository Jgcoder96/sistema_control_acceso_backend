import { transactionToDeleteRole } from '../models/index.js';

export const deleteRoleService = async (id: string) => {
  return await transactionToDeleteRole(id);
};
