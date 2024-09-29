import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs/operators';
import { AppResponseHandlerService } from '@core/services/app-response-handler.service';
import { UsersService } from '@core/api/services/users.service';
import { AutoUnsubscribe } from '@core/utils';
import { PasswordMatchValidator } from '@shared/validators/password-match-validator';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { RoleDtoService } from '@core/api/services/role-dto.service';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';

@AutoUnsubscribe
@Component({
  selector: 'app-create-edit-user',
  templateUrl: './create-edit-user.component.html',
})
export class CreateEditUserComponent implements OnInit {
  roles: any;
  form!: UntypedFormGroup;
  loading!: boolean;
  activeOptions = ACTIVE_OPTIONS;
  PERMISSIONS = AppPermissionsEnum;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private usersService: UsersService,
    private roleDtoService: RoleDtoService,
    private appResponseHandlerService: AppResponseHandlerService,
    private dialogRef: MatDialogRef<CreateEditUserComponent>,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [
        {
          value: this.dialogData?.id,
          disabled: true,
        },
      ],
      email: [
        this.dialogData?.result?.email,
        [Validators.required, Validators.email],
      ],
      first_name: [this.dialogData?.result?.first_name, Validators.required],
      last_name: [this.dialogData?.result?.last_name, Validators.required],
      username: [this.dialogData?.result?.username, Validators.required],
      role_id: [this.dialogData?.result?.roles[0]?.id, Validators.required],
      active: [this.dialogData?.result?.active, Validators.required],
      passwordForm: this.fb.group(
        {
          password: [undefined, !this.dialogData ? Validators.required : null],
          confirmPassword: [
            undefined,
            !this.dialogData ? Validators.required : null,
          ],
        },
        { validator: PasswordMatchValidator }
      ),
    });

    this.roleDtoService
      .getRoles({
        page_size: 5000,
      })
      .pipe(
        take(1),
        tap((roles: any) => {
          this.roles = roles.result;
        })
      )
      .subscribe();
  }
  save(): void {
    const {
      id,
      first_name,
      last_name,
      username,
      email,
      active,
      role_id,
      passwordForm,
    } = this.form.getRawValue();

    if (id) {
      const payload = {
        first_name,
        last_name,
        username,
        email,
        roles: [role_id],
        active,
      };
      this.usersService
        .updateUser(id, payload)
        .pipe(
          take(1),
          this.appResponseHandlerService.handleSuccessMessage(
            () => 'Edit Successfully!'
          ),
          tap(() => {
            this.dialogRef.close(true);
          })
        )
        .subscribe();
    } else {
      const payload = {
        email,
        first_name,
        last_name,
        username,
        password: passwordForm.password,
        role_id,
        active,
      };
      this.usersService
        .createUser(payload)
        .pipe(
          take(1),
          this.appResponseHandlerService.handleSuccessMessage(
            () => 'Created Successfully!'
          ),
          tap(() => {
            this.dialogRef.close(true);
          })
        )
        .subscribe();
    }
  }
}
