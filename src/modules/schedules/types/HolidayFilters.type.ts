export type HolidayStatus = 'active' | 'deleted' | 'all';

export interface HolidayFilters {
  status: HolidayStatus;
  search?: string;
  page: string;
  limit: string;
}
