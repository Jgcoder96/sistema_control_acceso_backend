import { getAppPermissions as getAppPermissionsModel } from '../models/index.js';
import type { AppPermissionFilters } from '../types/index.js';

export const getAppPermissionsService = async (
  filters: AppPermissionFilters,
) => {
  return await getAppPermissionsModel(filters);
};
