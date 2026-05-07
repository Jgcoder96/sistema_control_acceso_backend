import { getRoles as getRolesModel } from '../models/index.js';
import type { RoleFilters } from '../types/index.js';

export const getRolesService = async (filters: RoleFilters) => {
  return await getRolesModel(filters);
};
