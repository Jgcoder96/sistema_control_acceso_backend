import { MqttClient } from 'mqtt';
import { getCompleteDeviceData, getFestivos } from '../models/index.js';
import { macToBuffer, getDayId, getHMSTuple } from '../helpers/index.js';

export const handleDeviceSync = async (client: MqttClient, message: Buffer) => {
  try {
    const payload = JSON.parse(message.toString());
    if (payload.type !== 'sync_request') return;

    const {
      device_mac,
      mesh_id,
      version: device_version,
      full_sync_required,
    } = payload;

    // 1. Obtener datos de la DB
    const [deviceData, festivosRaw] = await Promise.all([
      getCompleteDeviceData(device_mac),
      getFestivos(),
    ]);

    // --- VALIDACIONES DE SEGURIDAD ---
    if (!deviceData) {
      console.log(`\n❌ ERROR: DISPOSITIVO NO REGISTRADO [${device_mac}]`);
      return;
    }

    const dbMeshId = deviceData.ubicaciones?.mesh_id || '00:00:00:00:00:00';
    if (dbMeshId !== mesh_id) {
      console.log(`\n❌ ERROR DE AUTENTICACIÓN (MESH_ID) para ${device_mac}`);
      return;
    }

    // --- LÓGICA DE VERSIÓN ---
    const isUpToDate =
      !full_sync_required && device_version === deviceData.version;

    // Identificadores (Siempre se envían para validación del Root/Hijo)
    const bufferMeshId = macToBuffer(dbMeshId);
    const bufferMac = macToBuffer(deviceData.mac);

    // Variables de respuesta
    let festivosBase64 = '';
    let permisosNvsBase64 = '';
    let totalPermisosCount = 0;

    if (isUpToDate) {
      // --- CASO A: TODO AL DÍA ---
      console.log(
        `\n✅ ${device_mac} ya está actualizado (V.${device_version}). Enviando confirmación mínima.`,
      );
      // festivos y permisos se quedan como strings vacíos ""
    } else {
      // --- CASO B: HAY CAMBIOS (O petición de carga total) ---
      console.log(
        `\n🔄 Actualizando ${device_mac}: Local V.${device_version} -> DB V.${deviceData.version}`,
      );

      // 1. Formatear Festivos
      const bufferFestivos = Buffer.alloc(festivosRaw.length * 4);
      festivosRaw.forEach((f, i) => {
        const offset = i * 4;
        bufferFestivos.writeUInt8(f.dia, offset);
        bufferFestivos.writeUInt8(f.mes, offset + 1);
        bufferFestivos.writeUInt16LE(f.anio || 0, offset + 2);
      });
      festivosBase64 = bufferFestivos.toString('base64');

      // 2. Formatear Permisos
      const permisosAplanados = (deviceData.permisos_fisicos || []).flatMap(
        (p) =>
          p.usuarios.tarjetas.map((t) => ({
            codigo: t.codigo,
            reglas: p.horarios.horario_detalles,
          })),
      );

      if (permisosAplanados.length > 0) {
        let totalSize = 0;
        permisosAplanados.forEach(
          (p) => (totalSize += 5 + p.reglas.length * 7),
        );

        const bufferPermisos = Buffer.alloc(totalSize);
        let offset = 0;

        permisosAplanados.forEach((p) => {
          bufferPermisos.writeUInt32LE(parseInt(p.codigo), offset);
          offset += 4;
          bufferPermisos.writeUInt8(p.reglas.length, offset);
          offset += 1;

          p.reglas.forEach((r) => {
            const inicio = getHMSTuple(new Date(r.hora_inicio));
            const fin = getHMSTuple(new Date(r.hora_fin));
            bufferPermisos.writeUInt8(
              getDayId(r.dia_semana, r.es_festivo ?? false),
              offset,
            );
            offset += 1;
            bufferPermisos.writeUInt8(inicio.h, offset);
            offset += 1;
            bufferPermisos.writeUInt8(inicio.m, offset);
            offset += 1;
            bufferPermisos.writeUInt8(inicio.s, offset);
            offset += 1;
            bufferPermisos.writeUInt8(fin.h, offset);
            offset += 1;
            bufferPermisos.writeUInt8(fin.m, offset);
            offset += 1;
            bufferPermisos.writeUInt8(fin.s, offset);
            offset += 1;
          });
        });
        permisosNvsBase64 = bufferPermisos.toString('base64');
        totalPermisosCount = permisosAplanados.length;
      }
    }

    // --- CONSTRUIR RESPUESTA ---
    const response = {
      type: 'sync_response',
      mesh_id: bufferMeshId.toString('base64'),
      mac: bufferMac.toString('base64'),
      version: deviceData.version,
      festivos: festivosBase64, // "" si está al día
      permisos_nvs: permisosNvsBase64, // "" si está al día
      total_permisos: totalPermisosCount,
    };

    client.publish(`device/sync/response`, JSON.stringify(response), {
      qos: 1,
    });

    console.log('='.repeat(50));
    console.log(`📤 RESPUESTA MQTT ENVIADA`);
    console.log(`   Versión: ${deviceData.version}`);
    console.log(
      `   Modo: ${isUpToDate ? 'Confirmación (Ligera)' : 'Actualización (Completa)'}`,
    );
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Error en handleDeviceSync:', (error as Error).message);
  }
};
