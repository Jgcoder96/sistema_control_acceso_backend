import { Router } from 'express';

export interface AppRoutes {
  accessPoints: Router;
  appPermisions: Router;
  auth: Router;
  cards: Router;
  schedules: Router;
  locations: Router;
  physicalPermits: Router;
  roles: Router;
  logs: Router;
}
