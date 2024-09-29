import { Component } from '@angular/core';
import { BaseService } from '@core/api/base-service';
import { AppConfigService } from '@core/services/app-config.service';
import { AuthService } from '@core/services/auth.service';

import { UploadFileComponent } from './components/upload-file.component';
import { MatDialog } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
})
export class NotificationListComponent extends BaseService {
  isUserLoggedIn!: boolean;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    config: AppConfigService
  ) {
    super(config);
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  openFileUpload() {
    this.dialog
      .open(UploadFileComponent, { maxWidth: '150px' })
      .afterClosed()
      .pipe(
        take(1),
        tap((result) => {
          if (result) {
            console.log(result);
          }
        })
      )
      .subscribe();
  }
  goToDocuments() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['documents/documents']);
    } else {
      this.router.navigate(['view-documents/view-documents']);
    }
  }
}
