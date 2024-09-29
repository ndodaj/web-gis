import { Data } from '@angular/router';
import { BreadcrumbType } from './breadcrumb-type';

export interface AppRouteData extends Data {
  scrollDisabled?: boolean;
  toolbarShadowEnabled?: boolean;
  containerEnabled?: boolean;
  breadcrumb?: BreadcrumbType;
  breadcrumbNotClickable?: boolean;
  pageTitle?: string;
}
