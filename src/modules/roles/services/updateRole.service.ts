import { transactionToUpdateRole } from '../models/index.js';
import type { RoleInBodyRequest } from '../types/index.js';

export const updateRoleService = async (
  roleID: string,
  role: RoleInBodyRequest,
) => {
  role.nombre = role.nombre.trim();
  role.descripcion = role.descripcion.trim();

  return await transactionToUpdateRole(roleID, role);
};
