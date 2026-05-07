import { transactionToCreateAppPermission } from '../models/index.js';
import type { AppPermissionInRequestBody } from '../types/index.js';

export const createAppPermissionService = async (
  permission: AppPermissionInRequestBody,
) => {
  permission.slug = permission.slug.trim();
  permission.descripcion = permission.descripcion.trim();

  return await transactionToCreateAppPermission(permission);
};
