import { prisma } from '../../config/prismaConnection.config.js';

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

  // 1. Buscamos el punto de acceso
  const puntoAcceso = await prisma.puntos_acceso.findUnique({
    where: { mac },
  });

  if (!puntoAcceso) throw new Error(`Punto de acceso ${mac} no existe.`);

  // 2. Buscamos si la tarjeta existe para vincularla
  const tarjeta = await prisma.tarjetas.findUnique({
    where: { codigo: normalizedCardCode },
  });

  // 3. Guardamos el log con AMBOS datos
  return await prisma.logs_acceso.create({
    data: {
      autorizado: authorized,
      fecha: date,
      punto_acceso_id: puntoAcceso.id,
      tarjeta_id: tarjeta ? tarjeta.id : null, // ID interno (si existe)
      codigo_tarjeta: cardCode, // Código real recibido por MQTT (ej: "10725571")
    },
  });
};
