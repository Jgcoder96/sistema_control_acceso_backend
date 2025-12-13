import { MqttClient } from 'mqtt';

export const eventHandlers = (client: MqttClient) => {
  client.on('connect', () => {
    console.log('✅ Servicio MQTT: Conectado exitosamente');
  });

  client.on('reconnect', () => {
    console.log('⚠️ Servicio MQTT: Re-conectando...');
  });

  client.on('error', (err) => {
    console.error('❌ Servicio MQTT Error:', err.message);
  });

  client.on('offline', () => {
    console.warn('🔌 Servicio MQTT: Desconectado (Offline)');
  });
};
