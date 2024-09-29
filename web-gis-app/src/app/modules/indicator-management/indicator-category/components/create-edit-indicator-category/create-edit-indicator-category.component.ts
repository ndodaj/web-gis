import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IndicatorCategoryService } from '@core/api/services/indicator-category.service';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { AppResponseHandlerService } from '@core/services/app-response-handler.service';
import { AutoUnsubscribe } from '@core/utils';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { take, tap } from 'rxjs';

@AutoUnsubscribe
@Component({
  selector: 'app-create-edit-indicator-category',
  templateUrl: './create-edit-indicator-category.component.html',
})
export class CreateEditIndicatorCategoryComponent implements OnInit {
  form!: UntypedFormGroup;
  PERMISSIONS = AppPermissionsEnum;

  activeOptions = ACTIVE_OPTIONS;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<CreateEditIndicatorCategoryComponent>,
    private indicatorCategoryService: IndicatorCategoryService,
    private appResponseHandlerService: AppResponseHandlerService
  ) {}
  ngOnInit() {
    this.form = this.fb.group({
      id: [
        {
          value: this.dialogData?.id,
          disabled: true,
        },
      ],
      name: [this.dialogData?.result?.name, Validators.required],
      accepted: [this.dialogData?.result?.accepted],
    });
  }
  save(): void {
    const { id, name, accepted } = this.form.getRawValue();

    if (id) {
      const payload: any = {
        name,
        accepted,
      };
      this.indicatorCategoryService
        .updateIndicatorCategory(id, payload)
        .pipe(
          take(1),
          this.appResponseHandlerService.handleSuccessMessage(
            () => 'Successfully updated!'
          ),
          tap(() => {
            this.dialogRef.close(true);
          })
        )
        .subscribe();
    } else {
      const payload: any = {
        name,
        accepted: false,
      };
      this.indicatorCategoryService
        .createIndicatorCategory(payload)
        .pipe(
          take(1),
          this.appResponseHandlerService.handleSuccessMessage(
            () => 'Created successfully!'
          ),
          tap(() => {
            this.dialogRef.close(true);
          })
        )
        .subscribe();
    }
  }

  returnBack(): void {
    this.dialogRef.close(true);
  }
}
