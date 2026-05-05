export type AccessCardStatus =
  | 'activable'
  | 'activa'
  | 'bloqueada'
  | 'perdida'
  | 'eliminada'
  | 'all';

export interface AccessCardFilters {
  status: AccessCardStatus;
  cedula?: string;
  codigo?: string;
  page: string;
  limit: string;
}
