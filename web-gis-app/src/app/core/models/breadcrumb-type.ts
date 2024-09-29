import { ActivatedRouteSnapshot } from '@angular/router';

export type BreadcrumbType =
  | string
  | ((route: ActivatedRouteSnapshot) => string)
  | undefined;
