import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttributeService } from '@core/api/services/attribute.service';
import { IndicatorDtoService } from '@core/api/services/indicator-dto.service';
import { AppResponseHandlerService } from '@core/services/app-response-handler.service';
import { AutoUnsubscribe } from '@core/utils';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { take, tap } from 'rxjs';

@AutoUnsubscribe
@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
})
export class FormDialogComponent implements OnInit {
  form!: UntypedFormGroup;
  indicators!: any;
  dataTypes = [
    {
      id: 1,
      data_type: 'INTEGER',
    },
    {
      id: 2,
      data_type: 'GEOMETRY',
    },
    {
      id: 3,
      data_type: 'STRING',
    },
    {
      id: 4,
      data_type: 'NUMBER',
    },
    {
      id: 5,
      data_type: 'DATE',
    },
    {
      id: 6,
      data_type: 'BOOLEAN',
    },
    {
      id: 7,
      data_type: 'PICTURE',
    },
    {
      id: 8,
      data_type: 'TEXT',
    },
    {
      id: 9,
      data_type: 'TIMESTAMP',
    },
  ];

  activeOptions = ACTIVE_OPTIONS;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<FormDialogComponent>,
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
      name: [this.dialogData?.result?.name, Validators.required],
      indicator: [this.dialogData?.result?.indicator?.id, Validators.required],
      data_type: [this.dialogData?.result?.data_type, Validators.required],
    });
  }
  save(): void {
    const { id, name, indicator, data_type } = this.form.getRawValue();

    if (id) {
      const payload: any = {
        indicator,
        name,
        data_type,
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
