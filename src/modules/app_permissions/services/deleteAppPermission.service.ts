import { transactionToDeleteAppPermission } from '../models/index.js';

export const deleteAppPermissionService = async (id: string) => {
  return await transactionToDeleteAppPermission(id);
};
