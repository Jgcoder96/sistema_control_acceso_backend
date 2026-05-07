import { transactionToCreateRole } from '../models/index.js';
import type { RoleInBodyRequest } from '../types/index.js';

export const createRoleService = async (role: RoleInBodyRequest) => {
  role.nombre = role.nombre.trim();
  role.descripcion = role.descripcion.trim();

  return await transactionToCreateRole(role);
};
