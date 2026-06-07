import pkg from 'pg';
const { Client } = pkg;
import { envs } from '../../config/index.js';
import { getClient } from '../connection/mqttClient.connection.js';
import { macToBuffer } from '../helpers/index.js';

export const accessPointsTableListener = async () => {
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
            const data = JSON.parse(msg.payload);

            const bufferMeshId = macToBuffer(data.mesh_id);
            const bufferMac = macToBuffer(data.mac);

            const topic = `device/sync/trigger`;

            const payload = {
              type: 'sync_trigger',
              mesh_id: bufferMeshId.toString('base64'),
              mac: bufferMac.toString('base64'),
              execute: true,
            };

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
      setTimeout(accessPointsTableListener, 5000);
    });
  } catch (error) {
    console.error('🚨 Error iniciando Watcher:', error);
    setTimeout(accessPointsTableListener, 5000);
  }
};
