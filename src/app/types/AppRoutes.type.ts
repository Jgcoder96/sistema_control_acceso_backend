import { Router } from 'express';

export interface AppRoutes {
  accessPoints: Router;
  auth: Router;
  cards: Router;
  config: Router;
  horary: Router;
  location: Router;
}
