export interface DeviceAccessPayload {
  card_id: string;
  access_granted: boolean;
  date: string;
  device_mac: string;
  mesh_id: string;
}

export const handleDeviceAccessEvent = async (
  message: Buffer,
): Promise<void> => {
  try {
    const payload: DeviceAccessPayload = JSON.parse(message.toString());

    console.info('🔔 Nuevo Evento de Acceso Recibido:');
    console.log(JSON.stringify(payload, null, 2));

    const status = payload.access_granted ? '✅ CONCEDIDO' : '❌ DENEGADO';
    console.info(
      `[${payload.date}] Tarjeta: ${payload.card_id} | Acceso: ${status} | Dispositivo: ${payload.device_mac}`,
    );
  } catch (error) {
    console.error('🚨 Error al parsear el evento de acceso:', error);
  }
};
