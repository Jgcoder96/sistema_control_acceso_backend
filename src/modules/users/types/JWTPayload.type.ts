export interface JWTPayload {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  foto_url?: string;
  roles: string[];
  permisos: string[];
}
