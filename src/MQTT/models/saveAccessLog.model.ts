import { prisma } from '../../config/index.js';

interface CreateLogDTO {
  cardCode: string;
  mac: string;
  authorized: boolean;
  date: Date;
}

export const saveAccessLog = async ({
  cardCode,
  mac,
  authorized,
  date,
}: CreateLogDTO) => {
  const normalizedCardCode = cardCode.trim().padStart(10, '0');

  const accessPoint = await prisma.puntos_acceso.findUnique({
    where: { mac },
  });

  if (!accessPoint) throw new Error(`Punto de acceso ${mac} no existe.`);

  const card = await prisma.tarjetas.findUnique({
    where: { codigo: normalizedCardCode },
  });

  return await prisma.logs_acceso.create({
    data: {
      autorizado: authorized,
      fecha: date,
      punto_acceso_id: accessPoint.id,
      tarjeta_id: card ? card.id : null,
      codigo_tarjeta: cardCode,
    },
  });
};
