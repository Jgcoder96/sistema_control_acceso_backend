import { prisma } from '../../../config/index.js';
import type { AppPermissionInRequestBody } from '../types/index.js';
import { AppPermissionSlugAlreadyExist } from '../errors/index.js';

export const transactionToCreateAppPermission = async (
  payload: AppPermissionInRequestBody,
) => {
  const { slug, descripcion } = payload;

  return await prisma.$transaction(async (tx) => {
    const existingPermission = await tx.app_permisos.findFirst({
      where: {
        slug: slug,
      },
      orderBy: {
        creado_el: 'desc',
      },
    });

    if (existingPermission) {
      if (existingPermission.eliminado_el === null)
        throw new AppPermissionSlugAlreadyExist();

      const permissionRestored = await tx.app_permisos.update({
        where: { id: existingPermission.id },
        data: {
          descripcion: descripcion ?? existingPermission.descripcion,
          eliminado_el: null,
        },
      });

      return permissionRestored;
    }

    const newPermission = await tx.app_permisos.create({
      data: {
        slug,
        descripcion,
      },
    });

    return newPermission;
  });
};
