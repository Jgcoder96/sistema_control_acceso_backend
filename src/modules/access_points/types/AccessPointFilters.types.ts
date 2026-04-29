export type Status = 'active' | 'deleted' | 'all';

export interface AccessPointFilters {
  limit: string;
  locationId: string;
  page: string;
  search?: string;
  status: Status;
}
