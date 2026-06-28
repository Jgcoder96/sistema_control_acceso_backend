import { encryptPassword } from '../modules/users/helpers/index.js';
import { envs } from '../config/index.js';
import { prisma } from '../config/index.js';
import { transactionToCreateUser } from '../modules/users/models/index.js';

async function main() {
  console.log('🚀 Iniciando creación de Super Admin...');

  const {
    SUPERADMIN_EMAIL = envs.SUPERADMIN_EMAIL,
    SUPERADMIN_PASSWORD = envs.SUPERADMIN_PASSWORD,
    SUPERADMIN_NOMBRE = envs.SUPERADMIN_NOMBRE,
    SUPERADMIN_APELLIDO = envs.SUPERADMIN_APELLIDO,
    SUPERADMIN_CEDULA = envs.SUPERADMIN_CEDULA,
    SUPERADMIN_PHOTO_KEY = 'static/admin-profile.png',
  } = process.env;

  try {
    const hashedPassword = await encryptPassword(SUPERADMIN_PASSWORD);

    const user = await transactionToCreateUser({
      nombre: SUPERADMIN_NOMBRE,
      apellido: SUPERADMIN_APELLIDO,
      cedula: SUPERADMIN_CEDULA,
      correo_electronico: SUPERADMIN_EMAIL,
      clave_hash: hashedPassword,
      foto_url: SUPERADMIN_PHOTO_KEY,
    });

    await prisma.$transaction(async (tx) => {
      const role = await tx.roles.upsert({
        where: { nombre: 'superAdmin' },
        update: {},
        create: {
          nombre: 'superAdmin',
          descripcion: 'Acceso total al sistema',
        },
      });

      await tx.usuario_roles.upsert({
        where: {
          usuario_id_rol_id: {
            usuario_id: user.id,
            rol_id: role.id,
          },
        },
        update: {},
        create: {
          usuario_id: user.id,
          rol_id: role.id,
        },
      });
    });

    console.log('✅ Super Admin configurado exitosamente.');
  } catch (error) {
    console.error('❌ Error en el proceso de Seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
