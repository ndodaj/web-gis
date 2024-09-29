import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BreadcrumbItem } from '../models/breadcrumb-item';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { BreadcrumbType } from '../models/breadcrumb-type';
import { AppRouteData } from '../models/app-router-data';

/**
 * This service contains all the logic for retrieving the breadcrumbs.
 * It looks in the route data for the property "breadcrumb" of type "BreadcrumbType"
 * and create the breadcrumb according to the data found.
 * Note:
 * "BreadcrumbType" can also be a function, if you need to make some BE call you can use a resolver and implement the
 * function to get the data from the "ActivatedRouteSnapshot" passed as parameter.
 */
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  breadcrumb: BreadcrumbItem[] = [];

  constructor(
    private router: Router //
  ) {}

  breadcrumb$(): Observable<BreadcrumbItem[]> {
    return this.router.events.pipe(
      // For every navigation
      filter((event) => event instanceof NavigationEnd),
      // Start on application bootstrap
      startWith(undefined),
      // Start preparing the breadcrumb
      map(() => this.prepareBreadcrumb(this.router.routerState.snapshot.root)),
      // The last breadcrumb should not be clickable
      map((breadcrumbs: BreadcrumbItem[]) => {
        if (breadcrumbs.length) {
          const lastIndex = breadcrumbs.length - 1;
          const { routerLink, ...newLast } = breadcrumbs[lastIndex];
          breadcrumbs[lastIndex] = newLast;
        }
        return breadcrumbs;
      })
    );
  }

  /*
   * This function recover the breadcrumbs from `parseRoute` and if there are updates them with the query params that were saved.
   * Because the `parseRoute` would not keep the query params.
   * @param route is the snapshot route
   * @returns BreadcrumbItem it's an array of breadcrumbs
   * */
  prepareBreadcrumb(route: ActivatedRouteSnapshot): BreadcrumbItem[] {
    // Parse the routerState to find breadcrumbs
    const createBreadcrumb: BreadcrumbItem[] = this.parseRoute(route);

    // Checks if there are any breadcrumbs
    if (createBreadcrumb?.length) {
      // Cycles the breadcrumb
      createBreadcrumb.forEach((menuItem, index) => {
        // Checks if the saved breadcrumb is not empty and if the saved breadcrumb is the same as the new one
        if (
          this.breadcrumb.length &&
          this.breadcrumb[index]?.id === menuItem.id
        ) {
          menuItem.queryParams = this.breadcrumb[index].queryParams;
        }
      });

      // Takes the last breadcrumbs and replaces the queryParams with the queryParams from route
      createBreadcrumb[createBreadcrumb.length - 1].queryParams =
        route.queryParams;
    }

    // Replaces the saved breadcrumb with the new breadcrumbs
    this.breadcrumb = [...createBreadcrumb];

    return this.breadcrumb;
  }

  /*
   * This function recursive builds the breadcrumbs from the route
   * @param route is the snapshot route
   * @returns BreadcrumbItem it's an array of breadcrumbs
   * */
  parseRoute(route: ActivatedRouteSnapshot): BreadcrumbItem[] {
    const breadcrumb = this.getBreadcrumbFromRouteData(
      (route.data as AppRouteData).breadcrumb,
      route
    );

    const breadcrumbNotClickable =
      route.routeConfig &&
      (route.routeConfig.data as AppRouteData | undefined)
        ?.breadcrumbNotClickable;

    const path = route.pathFromRoot
      .map((r) => r.url)
      .reduce((acc, r) => [...acc, ...r], [])
      .join('/');

    const ret: BreadcrumbItem[] = breadcrumb
      ? [
          {
            id: path,
            label: breadcrumb,
            routerLink: breadcrumbNotClickable ? undefined : '/' + path
          }
        ]
      : [];

    // Flatten all the breadcrumbs found in children
    return ret.concat(...route.children.map((c) => this.parseRoute(c)));
  }

  /*
   * This function help to extrapolate the name of breadcrumb
   * @param breadcrumbData is type of `BreadcrumbType`
   * @param route is the snapshot route
   * @returns string or undefined
   * */
  private getBreadcrumbFromRouteData(
    breadcrumbData: BreadcrumbType,
    route: ActivatedRouteSnapshot
  ): string | undefined {
    if (!breadcrumbData) {
      return undefined;
    }
    if (typeof breadcrumbData === 'string') {
      return breadcrumbData;
    } else {
      return breadcrumbData(route);
    }
  }
}
