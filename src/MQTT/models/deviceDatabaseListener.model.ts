import pkg from 'pg';
const { Client } = pkg;
import { envs } from '../../config/index.js';
import { getClient } from '../connection/mqttClient.connection.js';
import { macToBuffer } from '../helpers/index.js'; // Importamos tu helper

export const deviceDatabaseListener = async () => {
  const dbClient = new Client({ connectionString: envs.DATABASE_URL });

  try {
    await dbClient.connect();
    await dbClient.query('LISTEN device_desync');

    console.info('📡 DB-Watcher: Escuchando notificaciones de PostgreSQL...');

    dbClient.on('notification', (msg) => {
      if (msg.channel === 'device_desync' && msg.payload) {
        const mqtt = getClient();

        if (mqtt && mqtt.connected) {
          try {
            // 1. Parsear el JSON que viene de la DB (strings AA:BB...)
            const data = JSON.parse(msg.payload);

            // 2. Convertir a Buffers binarios (6 bytes cada uno)
            const bufferMeshId = macToBuffer(data.mesh_id);
            const bufferMac = macToBuffer(data.mac);

            // 3. Preparar el payload minimalista
            const topic = `device/sync/trigger`;
            const payload = {
              type: 'sync_trigger', // Usamos type para ser consistentes
              mesh_id: bufferMeshId.toString('base64'), // Binario en Base64
              mac: bufferMac.toString('base64'), // Binario en Base64
              execute: true, // El booleano que definimos para el gatillo
            };

            // 4. Publicar
            mqtt.publish(topic, JSON.stringify(payload), { qos: 1 });

            console.info(`\n🔔 DB-Notify: Gatillo enviado para ${data.mac}`);
            console.info(
              `   Payload binario: MESH[${payload.mesh_id}] MAC[${payload.mac}]`,
            );
          } catch (parseError) {
            console.error('❌ Error parseando notificación de DB:', parseError);
          }
        } else {
          console.warn('⚠️ DB-Watcher: MQTT no disponible.');
        }
      }
    });

    dbClient.on('error', (err) => {
      console.error('🚨 DB-Watcher Connection Error:', err);
      setTimeout(deviceDatabaseListener, 5000);
    });
  } catch (error) {
    console.error('🚨 Error iniciando Watcher:', error);
    setTimeout(deviceDatabaseListener, 5000);
  }
};
