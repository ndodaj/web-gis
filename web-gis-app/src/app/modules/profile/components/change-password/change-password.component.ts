import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { AccountService } from '@core/api/services/account.service';
import { PasswordMatchValidator } from '@shared/validators/password-match-validator';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  passwordForm!: UntypedFormGroup;
  loading!: boolean;
  constructor(
    private accountService: AccountService,
    private fb: UntypedFormBuilder
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: [undefined, Validators.required],
      changePasswordForm: this.fb.group(
        {
          newPassword: [undefined, Validators.required],
          confirmNewPassword: [undefined, Validators.required]
        },
        { validator: PasswordMatchValidator }
      )
    });
  }

  submit(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const { currentPassword, changePasswordForm } =
      this.passwordForm.getRawValue();
    const payload: any = {
      currentPassword,
      newPassword: changePasswordForm.newPassword,
      confirmNewPassword: changePasswordForm.confirmNewPassword
    };
    this.accountService
      .changeOwnPassword(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }
}
