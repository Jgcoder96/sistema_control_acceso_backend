export type RoleStatus = 'active' | 'deleted' | 'all';

export interface RoleFilters {
  status?: RoleStatus;
  search?: string;
  page: string;
  limit: string;
}
