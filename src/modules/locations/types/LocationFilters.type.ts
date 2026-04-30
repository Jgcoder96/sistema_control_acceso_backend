export type LocationStatus = 'active' | 'deleted' | 'all';

export interface LocationFilters {
  status: LocationStatus;
  search?: string;
  page: string;
  limit: string;
}
