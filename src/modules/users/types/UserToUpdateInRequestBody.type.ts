export interface UserToUpdateInRequestBody {
  apellido: string;
  cedula: string;
  clave?: string;
  correo_electronico: string;
  estado: 'activo' | 'inactivo';
  nombre: string;
}
