export type Status = 'active' | 'deleted' | 'all';

export interface AppPermissionFilters {
  status?: Status;
  search?: string;
  page: string;
  limit: string;
}
