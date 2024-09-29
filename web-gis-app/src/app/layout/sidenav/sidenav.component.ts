import { Component, Input } from '@angular/core';
import { map, startWith, switchMap } from 'rxjs/operators';

import { ThemeConfigService } from '@core/services/theme-config.service';
import { LayoutService } from '@core/services/layout.service';
import { NavigationService } from '@core/services/navigation.service';
import { NavigationItem } from '@core/models/navigation-item';
import { Observable, of } from 'rxjs';
import { PopoverService } from '@core/services/popover.service';
import { UserMenuComponent } from '@layout/user-menu/user-menu.component';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  @Input() collapsed!: boolean | null;
  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.themeConfigService.config$.pipe(
    map((config) => config.sidenav.title)
  );
  imageUrl$ = this.themeConfigService.config$.pipe(
    map((config) => config.sidenav.imageUrl)
  );
  showCollapsePin$ = this.themeConfigService.config$.pipe(
    map((config) => config.sidenav.showCollapsePin)
  );
  userVisible$ = this.themeConfigService.config$.pipe(
    map((config) => config.sidenav.user.visible)
  );

  items = this.navigationService.items;

  userMenuOpen$: Observable<boolean> = of(false);

  userName = this.authService.getDecodedTokenClaim('username');

  userRole = this.authService.getDecodedTokenClaim('UserRoles');

  constructor(
    private navigationService: NavigationService,
    private layoutService: LayoutService,
    private themeConfigService: ThemeConfigService,
    private readonly popoverService: PopoverService,
    private authService: AuthService
  ) {}

  collapseOpenSidenav() {
    this.layoutService.collapseOpenSidenav();
  }

  collapseCloseSidenav() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    this.collapsed
      ? this.layoutService.expandSidenav()
      : this.layoutService.collapseSidenav();
  }

  trackByRoute(_: number, item: NavigationItem): string {
    return item.label;
  }

  openProfileMenu(origin: HTMLDivElement): void {
    this.userMenuOpen$ = of(
      this.popoverService.open({
        content: UserMenuComponent,
        origin,
        offsetY: -8,
        width: origin.clientWidth,
        positions: [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom'
          }
        ]
      })
    ).pipe(
      switchMap((popoverRef) => popoverRef.afterClosed$.pipe(map(() => false))),
      startWith(true)
    );
  }
}
