import { Router } from 'express';

export interface AppRoutes {
  auth: Router;
  config: Router;
  cards: Router;
  location: Router;
  accessPoints: Router;
}
