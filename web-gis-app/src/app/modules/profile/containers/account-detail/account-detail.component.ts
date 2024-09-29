import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { AutoUnsubscribe, unsubscribeOnDestroy } from '@core/utils';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { ActivatedRoute } from '@angular/router';

@AutoUnsubscribe
@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
})
export class ProfileComponent {
  changePasswordform!: UntypedFormGroup;
  userForm!: UntypedFormGroup;
  userDetail!: any;
  constructor(private dialog: MatDialog, private route: ActivatedRoute) {
    this.route.data.pipe(unsubscribeOnDestroy(this)).subscribe((data) => {
      this.userDetail = data.accountDetail.data;
    });
  }

  openChangePasswordModal(): void {
    this.dialog
      .open(ChangePasswordComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe();
  }
}
