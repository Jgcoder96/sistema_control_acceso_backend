import { prisma } from './src/config/index.js';
async function main() {
  const logs = await prisma.logs_acceso.findMany({
    take: 50,
    orderBy: { fecha: 'desc' },
    include: { puntos_acceso: true }
  });
  console.log(logs.filter(l => l.puntos_acceso.nombre !== 'LED').map(l => ({ id: l.id, fecha: l.fecha, pa: l.puntos_acceso.nombre })));
  process.exit(0);
}
main();
