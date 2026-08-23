import { prisma } from './src/config/index.js';
async function main() {
  const puntos = await prisma.puntos_acceso.findMany();
  console.log(puntos);
  process.exit(0);
}
main();
