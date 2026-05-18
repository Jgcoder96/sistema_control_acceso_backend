export type Status = 'active' | 'deleted' | 'all';

export interface UserFilters {
  status?: Status;
  search?: string;
  page: string;
  limit: string;
}
