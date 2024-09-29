import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { ThemeConfigService } from '@core/services/theme-config.service';
import { LayoutService } from '@core/services/layout.service';
import { NavigationService } from '@core/services/navigation.service';
import { AuthService } from '@core/services/auth.service';
import { UserToolbarMenuComponent } from '@layout/user-toolbar-menu/user-toolbar-menu.component';
import { PopoverService } from '@core/services/popover.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '@core/api/services/account.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() mobileQuery!: boolean | null;

  @Input()
  @HostBinding('class.shadow-b')
  hasShadow!: boolean | null;
  currentLanguage!: string;
  appVersion = environment.appVersion;
  navigationItems = this.navigationService.items;

  isVerticalLayout$: Observable<boolean> = this.themeConfigService.config$.pipe(
    map((config) => config.layout === 'vertical')
  );
  isNavbarInToolbar$: Observable<boolean> =
    this.themeConfigService.config$.pipe(
      map((config) => config.navbar.position === 'in-toolbar')
    );
  isNavbarBelowToolbar$: Observable<boolean> =
    this.themeConfigService.config$.pipe(
      map((config) => config.navbar.position === 'below-toolbar')
    );
  userVisible$: Observable<boolean> = this.themeConfigService.config$.pipe(
    map((config) => config.toolbar.user.visible)
  );

  userName!: any;
  isLogedIn = this.authService.isLoggedIn() ? true : false;
  dropdownOpen!: boolean;

  constructor(
    private layoutService: LayoutService,
    private themeConfigService: ThemeConfigService,
    private navigationService: NavigationService,
    private authService: AuthService,
    private popover: PopoverService,
    private cd: ChangeDetectorRef,
    protected router: Router,
    private translateService: TranslateService,
    private accountService: AccountService
  ) {
    this.currentLanguage = this.translateService.currentLang || 'en';
    if (this.isLogedIn) {
      this.accountService
        .getCurrentUser()
        .pipe(
          take(1),
          tap((data: any) => {
            this.userName = data?.data?.username;
          })
        )
        .subscribe();
    }
  }

  openSidenav(): void {
    this.layoutService.openSidenav();
  }

  showPopover(originRef: HTMLElement) {
    this.dropdownOpen = true;
    this.cd.markForCheck();

    const popoverRef = this.popover.open({
      content: UserToolbarMenuComponent,
      origin: originRef,
      offsetY: 12,
      positions: [
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ],
    });

    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
  goToMap() {
    this.router.navigateByUrl('/map');
  }

  changeLanguage() {
    const newLanguage = this.currentLanguage === 'en' ? 'sq' : 'en';
    this.translateService.use(newLanguage);
    this.currentLanguage = newLanguage;
    // location.reload()
  }
}
