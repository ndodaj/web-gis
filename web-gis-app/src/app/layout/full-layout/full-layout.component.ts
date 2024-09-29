import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ThemeConfigService } from '@core/services/theme-config.service';
import { LayoutService } from '@core/services/layout.service';
import { checkRouterChildsData } from '@core/utils/check-router-childs-data';
import { BreadcrumbService } from '@core/services/breadcrumb.service';
import { BreadcrumbItem } from '@core/models/breadcrumb-item';
import { AppRouteData } from '@core/models/app-router-data';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent {
  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  isFooterVisible$ = this.themeConfigService.config$.pipe(
    map((config) => config.footer.visible)
  );
  isDesktop$ = this.layoutService.isDesktop$;

  toolbarShadowEnabled$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() =>
      checkRouterChildsData(
        this.router.routerState.root.snapshot as ActivatedRouteSnapshot & {
          data?: AppRouteData;
        },
        (data) => !!data.toolbarShadowEnabled
      )
    )
  );

  pageTitle$: Observable<string | undefined> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.router.routerState.root.snapshot),
    map((route) => {
      while (route.firstChild) route = route.firstChild;
      return route;
    }),
    map((route) => (route.data as AppRouteData).pageTitle)
  );

  breadcrumb$: Observable<BreadcrumbItem[] | undefined> =
    this.breadcrumbService.breadcrumb$();

  constructor(
    private layoutService: LayoutService,
    private themeConfigService: ThemeConfigService,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}
}
