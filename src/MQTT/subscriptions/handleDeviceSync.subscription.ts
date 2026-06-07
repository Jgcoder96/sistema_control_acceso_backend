import { MqttClient } from 'mqtt';
import {
  countTotalCards,
  getDeviceInfo,
  getHolidays,
  getPaginatedCards,
  type PaginatedCards,
} from '../models/index.js';
import { macToBuffer, getDayId, getHMSTuple } from '../helpers/index.js';

const PAGE_SIZE = 10;

export const handleDeviceSync = async (client: MqttClient, message: Buffer) => {
  try {
    const payload = JSON.parse(message.toString());

    if (payload.type !== 'sync_request') return;

    const {
      device_mac,
      mesh_id,
      version: device_version,
      full_sync_required,
      page: requestedPage = 1,
    } = payload;

    const deviceData = await getDeviceInfo(device_mac);

    if (!deviceData) {
      console.log(`\n❌ ERROR: DISPOSITIVO NO REGISTRADO [${device_mac}]`);
      return;
    }

    const isDeleted =
      deviceData.eliminado_el !== null ||
      (deviceData.ubicaciones && deviceData.ubicaciones.eliminado_el !== null);

    const dbMeshId = deviceData.ubicaciones?.mesh_id || '00:00:00:00:00:00';

    if (dbMeshId !== mesh_id) {
      console.log(`\n❌ ERROR DE AUTENTICACIÓN (MESH_ID)`);
      return;
    }

    const isUpToDate =
      !isDeleted &&
      !full_sync_required &&
      device_version === deviceData.version &&
      requestedPage === 1;

    const bufferMeshId = macToBuffer(dbMeshId);
    const bufferMac = macToBuffer(deviceData.mac);

    let HolidaysBase64 = '';
    let permissionsNVSBase64 = '';
    let totalPages = 1;
    let cardsRaw: PaginatedCards = [];

    if (isDeleted) {
      console.log(
        `\n⚠️ DISPOSITIVO/UBICACIÓN MARCADO COMO ELIMINADO [${device_mac}]. Enviando respuesta vacía.`,
      );
    } else if (isUpToDate) {
      console.log(
        `\n✅ ${device_mac} ya está actualizado (V.${device_version}).`,
      );
    } else {
      const totalCardsCount = await countTotalCards(device_mac);
      totalPages = Math.ceil(totalCardsCount / PAGE_SIZE) || 1;

      console.log(
        `\n🔄 Sincronizando ${device_mac} - Página ${requestedPage} de ${totalPages}`,
      );

      if (requestedPage === 1) {
        const HolidaysRaw = await getHolidays();
        const bufferHolidays = Buffer.alloc(HolidaysRaw.length * 4);
        HolidaysRaw.forEach((f, i) => {
          const offset = i * 4;
          bufferHolidays.writeUInt8(f.dia, offset);
          bufferHolidays.writeUInt8(f.mes, offset + 1);
          bufferHolidays.writeUInt16LE(f.anio || 0, offset + 2);
        });
        HolidaysBase64 = bufferHolidays.toString('base64');
      }

      const skip = (requestedPage - 1) * PAGE_SIZE;
      cardsRaw = await getPaginatedCards(device_mac, skip, PAGE_SIZE);

      if (cardsRaw.length > 0) {
        let totalSize = 0;
        cardsRaw.forEach((card) => {
          const rules =
            card.usuarios?.permisos_fisicos[0]?.horarios.horario_detalles || [];
          totalSize += 5 + rules.length * 7;
        });

        const bufferPermissions = Buffer.alloc(totalSize);
        let offset = 0;

        cardsRaw.forEach((card) => {
          const rules =
            card.usuarios?.permisos_fisicos[0]?.horarios.horario_detalles || [];
          bufferPermissions.writeUInt32LE(parseInt(card.codigo), offset);
          offset += 4;
          bufferPermissions.writeUInt8(rules.length, offset);
          offset += 1;

          rules.forEach((r) => {
            const start = getHMSTuple(new Date(r.hora_inicio));
            const end = getHMSTuple(new Date(r.hora_fin));
            bufferPermissions.writeUInt8(
              getDayId(r.dia_semana, r.es_festivo ?? false),
              offset,
            );
            offset += 1;
            bufferPermissions.writeUInt8(start.h, offset);
            offset += 1;
            bufferPermissions.writeUInt8(start.m, offset);
            offset += 1;
            bufferPermissions.writeUInt8(start.s, offset);
            offset += 1;
            bufferPermissions.writeUInt8(end.h, offset);
            offset += 1;
            bufferPermissions.writeUInt8(end.m, offset);
            offset += 1;
            bufferPermissions.writeUInt8(end.s, offset);
            offset += 1;
          });
        });
        permissionsNVSBase64 = bufferPermissions.toString('base64');
      }
    }

    const response = {
      type: 'sync_response',
      mesh_id: bufferMeshId.toString('base64'),
      mac: bufferMac.toString('base64'),
      version: deviceData.version,
      current_page: requestedPage,
      total_pages: totalPages,
      festivos: HolidaysBase64,
      permisos_nvs: permissionsNVSBase64,
    };

    client.publish(`device/sync/response`, JSON.stringify(response), {
      qos: 1,
    });

    console.log('='.repeat(50));
    console.log(`📤 PÁGINA ${requestedPage}/${totalPages} ENVIADA`);
    console.log(`   Estado: ${isDeleted ? 'ELIMINADO (Vaciando)' : 'ACTIVO'}`);
    console.log(`   Tarjetas enviadas: ${cardsRaw.length}`);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Error en handleDeviceSync:', (error as Error).message);
  }
};
