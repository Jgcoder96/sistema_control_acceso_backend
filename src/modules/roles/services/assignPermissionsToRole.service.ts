import { transactionToAssignPermissionsToRole } from '../models/index.js';
import type { PermissionsInRequestBody } from '../types/index.js';

export const assignPermissionsToRoleService = async (
  roleID: string,
  permissions: PermissionsInRequestBody,
) => {
  return await transactionToAssignPermissionsToRole(roleID, permissions);
};
