import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttributeService } from '@core/api/services/attribute.service';
import { IndicatorDtoService } from '@core/api/services/indicator-dto.service';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { AppResponseHandlerService } from '@core/services/app-response-handler.service';
import { AutoUnsubscribe } from '@core/utils';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { take, tap } from 'rxjs';

@AutoUnsubscribe
@Component({
  selector: 'app-create-edit-attribute',
  templateUrl: './create-edit-attribute.component.html',
})
export class CreateEditAttributeComponent implements OnInit {
  form!: UntypedFormGroup;
  indicators!: any;
  dataTypes = [
    {
      id: 1,
      data_type: 'TEXT',
    },
    {
      id: 2,
      data_type: 'NUMBER',
    },
    {
      id: 3,
      data_type: 'DATE',
    },
    {
      id: 4,
      data_type: 'BOOLEAN',
    },
    {
      id: 5,
      data_type: 'PICTURE',
    },
  ];
  PERMISSIONS = AppPermissionsEnum;
  activeOptions = ACTIVE_OPTIONS;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<CreateEditAttributeComponent>,
    private indicatorDtoService: IndicatorDtoService,
    private attributeService: AttributeService,
    private appResponseHandlerService: AppResponseHandlerService
  ) {}
  ngOnInit() {
    this.indicatorDtoService
      .getIndicators({
        page_size: 5000,
      })
      .pipe(
        take(1),
        tap((indicators: any) => {
          this.indicators = indicators.result;
        })
      )
      .subscribe();

    this.form = this.fb.group({
      id: [
        {
          value: this.dialogData?.id,
          disabled: true,
        },
      ],
      name: [
        {
          value: this.dialogData?.result?.name,
          disabled: !!this.dialogData,
        },
        Validators.required,
      ],
      accepted: [
        {
          value: !!this.dialogData ? this.dialogData?.result?.accepted : false,
          disabled: !this.dialogData,
        },
      ],
      indicator: [
        {
          value: this.dialogData?.result?.indicator?.id,
          disabled: !!this.dialogData,
        },
        Validators.required,
      ],
      data_type: [
        {
          value: this.dialogData?.result?.data_type,
          disabled: !!this.dialogData,
        },
        Validators.required,
      ],
    });
  }
  save(): void {
    const { id, name, indicator, data_type, accepted } =
      this.form.getRawValue();

    if (id) {
      const payload: any = {
        indicator,
        name,
        data_type,
        accepted,
      };
      this.attributeService
        .updateAttribute(id, payload)
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
        indicator,
        data_type,
        accepted: false,
      };
      this.attributeService
        .createAttribute(payload)
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
