import { prisma } from '../../config/index.js';

interface SyncAckPayload {
  type: string;
  version: number;
  success: boolean;
  device_mac: string;
  mesh_id: string;
}

export const handleDeviceSyncSuccessful = async (message: Buffer) => {
  try {
    const payload: SyncAckPayload = JSON.parse(message.toString());

    if (!payload.success) {
      console.warn(
        `⚠️ El dispositivo ${payload.device_mac} reportó un fallo en la escritura NVS.`,
      );
      return;
    }

    // Actualizamos la base de datos
    const updatedDevice = await prisma.puntos_acceso.update({
      where: {
        mac: payload.device_mac,
      },
      data: {
        esta_sincronizado: true,
        // Opcional: podrías guardar la versión confirmada si tuvieras un campo para ello
      },
    });

    console.log('\n' + '='.repeat(50));
    console.log(`✅ DISPOSITIVO SINCRONIZADO EN DB`);
    console.log(`   Nombre: ${updatedDevice.nombre}`);
    console.log(`   MAC: ${payload.device_mac}`);
    console.log(`   Versión Confirmada: ${payload.version}`);
    console.log('='.repeat(50));
  } catch (error) {
    console.error(
      '❌ Error procesando el ACK de sincronización:',
      (error as Error).message,
    );
  }
};
