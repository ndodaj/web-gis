import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PopoverService } from '@core/services/popover.service';
import { ThemeConfigService } from '@core/services/theme-config.service';
import { UserMenuComponent } from '@layout/user-menu/user-menu.component';
import { TranslateService } from '@ngx-translate/core';

import { Observable, map, take, tap } from 'rxjs';
import { AutoUnsubscribe } from '@core/utils';
import { AccountService } from '@core/api/services/account.service';
@AutoUnsubscribe
@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  userDetail!: any;

  currentLanguage!: string;
  userVisible$: Observable<boolean> = this.themeConfigService.config$.pipe(
    map((config) => config.toolbar.user.visible)
  );

  userName!: any;
  isLogedIn = this.authService.isLoggedIn() ? true : false;
  dropdownOpen!: boolean;

  constructor(
    protected router: Router,
    private themeConfigService: ThemeConfigService,
    private authService: AuthService,
    private accountService: AccountService,
    private cd: ChangeDetectorRef,
    private popover: PopoverService,
    private translateService: TranslateService
  ) {
    this.currentLanguage = this.translateService.currentLang || 'en';
  }

  ngOnInit(): void {
    if (this.isLogedIn) {
      this.accountService
        .getCurrentUser()
        .pipe(
          take(1),
          tap((data: any) => {
            this.userDetail = data.data;

            this.userName = this.userDetail.username;
          })
        )
        .subscribe();
    }
  }

  changeLanguage() {
    const newLanguage = this.currentLanguage === 'en' ? 'sq' : 'en';
    this.translateService.use(newLanguage);
    this.currentLanguage = newLanguage;
  }

  login() {
    this.router.navigateByUrl('/auth/login');
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  showPopover(originRef: HTMLElement) {
    this.dropdownOpen = true;
    this.cd.markForCheck();

    const popoverRef = this.popover.open({
      content: UserMenuComponent,
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
}
