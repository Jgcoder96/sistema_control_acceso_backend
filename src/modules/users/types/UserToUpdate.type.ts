export interface UserToUpdate {
  nombre: string;
  apellido: string;
  cedula: string;
  correo_electronico: string;
  estado: 'activo' | 'inactivo';
  foto_url: string | undefined;
  clave_hash: string | undefined;
}
