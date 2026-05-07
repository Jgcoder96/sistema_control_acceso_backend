import { AppPermissionDoesNotExist } from '../errors/index.js';
import { prisma } from '../../../config/index.js';

export const transactionToDeleteAppPermission = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const permissionExists = await tx.app_permisos.findFirst({
      where: {
        id: id,
        eliminado_el: null,
      },
    });

    if (!permissionExists) throw new AppPermissionDoesNotExist();

    const deletedPermission = await tx.app_permisos.update({
      where: { id: id },
      data: {
        eliminado_el: new Date(),
      },
    });

    return deletedPermission;
  });
};
