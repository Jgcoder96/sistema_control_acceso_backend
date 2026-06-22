import { prisma } from '../../../config/index.js';
import { Prisma, type usuarios } from '@prisma/client';

export interface UserWithAuth extends usuarios {
  roles: string[];
  permisos: string[];
}

const userAuthInclude = Prisma.validator<Prisma.usuariosInclude>()({
  usuario_roles: {
    include: {
      roles: {
        include: {
          rol_permisos: {
            include: {
              app_permisos: true,
            },
          },
        },
      },
    },
  },
});

type UsuarioConRelaciones = Prisma.usuariosGetPayload<{
  include: typeof userAuthInclude;
}>;

export const getUserByEmail = async (
  email: string,
): Promise<UserWithAuth | null> => {
  const user = await prisma.usuarios.findFirst({
    where: {
      correo_electronico: email,
      eliminado_el: null,
      estado: 'activo',
    },
    include: userAuthInclude,
  });

  if (!user) return null;

  const u = user as UsuarioConRelaciones;

  const roles = u.usuario_roles
    .filter((ur) => ur.roles && ur.roles.eliminado_el === null)
    .map((ur) => ur.roles.nombre);

  const permisos = Array.from(
    new Set(
      u.usuario_roles
        .filter((ur) => ur.roles && ur.roles.eliminado_el === null)
        .flatMap((ur) =>
          ur.roles.rol_permisos
            .filter(
              (rp) => rp.app_permisos && rp.app_permisos.eliminado_el === null,
            )
            .map((rp) => rp.app_permisos.slug),
        ),
    ),
  );

  return {
    id: u.id,
    nombre: u.nombre,
    apellido: u.apellido,
    cedula: u.cedula,
    correo_electronico: u.correo_electronico,
    foto_url: u.foto_url,
    estado: u.estado,
    clave_hash: u.clave_hash,
    creado_el: u.creado_el,
    actualizado_el: u.actualizado_el,
    eliminado_el: u.eliminado_el,
    roles,
    permisos,
  };
};
