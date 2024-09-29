import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PopoverRef } from '@shared/components/popover/popover-ref';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  constructor(
    private readonly popoverRef: PopoverRef,
    private authService: AuthService,
    private router: Router
  ) {}

  close(): void {
    /** Wait for animation to complete and then close */
    setTimeout(() => this.popoverRef.close(), 250);
  }

  logout(): void {
    this.authService.logout();
    this.popoverRef.close();
  }
  openProfile(): void {
    this.router.navigate(['/user-profile']);
    this.popoverRef.close();
  }
  openDashboard(): void {
    this.router.navigate(['/dashboard']);
    this.popoverRef.close();
  }
}
