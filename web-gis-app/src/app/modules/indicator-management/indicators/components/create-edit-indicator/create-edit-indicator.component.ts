import { Component, Inject } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AutoUnsubscribe } from '@core/utils';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { IndicatorService } from '@core/api/services/indicator.service';
import { take, tap } from 'rxjs';
import { AppResponseHandlerService } from '@core/services/app-response-handler.service';

import { IndicatorCategoryDtoService } from '@core/api/services/indicator-category-dto.service';
import { GeometryTypeDtoService } from '@core/api/services/geometry-type-dto.service';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
@AutoUnsubscribe
@Component({
  selector: 'app-create-edit-indicator',
  templateUrl: './create-edit-indicator.component.html',
})
export class CreateEditIndicatorComponent {
  form!: UntypedFormGroup;
  indicatorCategories!: any;
  geometryTypes!: any;
  PERMISSIONS = AppPermissionsEnum;
  activeOptions = ACTIVE_OPTIONS;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private indicatorService: IndicatorService,
    private indicatorCategoryDtoService: IndicatorCategoryDtoService,
    private geometryTypeDtoService: GeometryTypeDtoService,
    private appResponseHandlerService: AppResponseHandlerService,
    private dialogRef: MatDialogRef<CreateEditIndicatorComponent>,
    private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      id: [
        {
          value: this.dialogData?.id,
          disabled: true,
        },
      ],
      indicator_category: [
        this.dialogData?.result?.indicator_category?.id,
        Validators.required,
      ],
      name: [
        { value: this.dialogData?.result?.name, disabled: !!this.dialogData },
        Validators.required,
      ],
      accepted: [
        {
          value: !!this.dialogData ? this.dialogData?.result?.accepted : false,
          disabled: !this.dialogData,
        },
      ],
      geometry_type: [
        {
          value: this.dialogData?.result?.geometry_type?.id,
          disabled: !!this.dialogData,
        },
        Validators.required,
      ],
    });
    this.indicatorCategoryDtoService
      .getIndicatorCategories({
        page_size: 5000,
      })
      .pipe(
        take(1),
        tap((categories: any) => {
          this.indicatorCategories = categories.result;
        })
      )
      .subscribe();
    this.geometryTypeDtoService
      .getGeometryTypes()
      .pipe(
        take(1),
        tap((geometryTypes: any) => {
          this.geometryTypes = geometryTypes.result;
        })
      )
      .subscribe();
  }

  save(): void {
    const { id, indicator_category, name, geometry_type, accepted } =
      this.form.getRawValue();
    if (id) {
      const payload = {
        indicator_category,
        name,
        geometry_type,
        accepted,
      };
      this.indicatorService
        .updateIndicator(id, payload)
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
      const payload = {
        indicator_category,
        name,
        geometry_type,
        accepted: false,
      };
      this.indicatorService
        .createIndicator(payload)
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
}
