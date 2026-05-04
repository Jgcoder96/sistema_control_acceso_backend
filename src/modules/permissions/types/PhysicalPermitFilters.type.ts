export type FilterStatus = 'active' | 'deleted' | 'all';

export interface PhysicalPermitFilters {
  status: FilterStatus;
  cedula?: string;
  puntoAcceso?: string;
  ubicacion?: string;
  page: string;
  limit: string;
}
