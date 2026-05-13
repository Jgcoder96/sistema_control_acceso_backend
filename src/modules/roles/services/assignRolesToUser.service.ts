import { transactionToAssignRolesToUser } from '../models/index.js';
import type { RolesInRequestBody } from '../types/index.js';

export const assignRolesToUserService = async (
  userID: string,
  roles: RolesInRequestBody,
) => {
  return await transactionToAssignRolesToUser(userID, roles);
};
