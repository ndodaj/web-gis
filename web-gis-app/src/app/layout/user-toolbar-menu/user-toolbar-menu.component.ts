import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@core/api/services/account.service';
import { MenuItem } from '@core/models/menu-item';
import { AuthService } from '@core/services/auth.service';
import { PopoverRef } from '@shared/components/popover/popover-ref';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-user-toolbar-menu',
  templateUrl: './user-toolbar-menu.component.html',
  styleUrls: ['./user-toolbar-menu.component.scss'],
})
export class UserToolbarMenuComponent {
  items: MenuItem[] = [
    {
      icon: 'mat:account_circle',
      label: 'Profile',
      description: 'Personal data and account management',
      route: '/user-profile',
    },
  ];
  userName!: any;

  constructor(
    private popoverRef: PopoverRef<UserToolbarMenuComponent>,
    private authService: AuthService,
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService
      .getCurrentUser()
      .pipe(
        take(1),
        tap((data: any) => {
          this.userName = data.data.username;
        })
      )
      .subscribe();
  }

  close() {
    this.popoverRef.close();
  }
  openProfile(): void {
    this.router.navigate(['/user-profile']);
    this.popoverRef.close();
  }
  logout(): void {
    this.authService.logout();
    this.close();
  }
}
