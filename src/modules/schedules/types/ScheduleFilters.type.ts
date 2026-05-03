export type ScheduleStatus = 'active' | 'deleted' | 'all';

export interface ScheduleFilters {
  status: ScheduleStatus;
  search?: string;
  page: string;
  limit: string;
}
