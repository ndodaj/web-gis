import { Route } from '@angular/router';
import { AppRouteData } from './app-router-data';

export interface AppRoute extends Route {
  data?: AppRouteData;
  children?: AppRoute[];
}
