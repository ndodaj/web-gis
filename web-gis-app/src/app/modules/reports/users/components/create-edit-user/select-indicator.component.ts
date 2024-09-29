import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AutoUnsubscribe } from '@core/utils';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { SharedModule } from '@shared/shared.module';

@AutoUnsubscribe
@Component({
  selector: 'app-select-indicator',
  templateUrl: './select-indicator.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class SelectIndicatorComponent implements OnInit {
  roles: any;
  form!: UntypedFormGroup;
  loading!: boolean;
  activeOptions = ACTIVE_OPTIONS;
  PERMISSIONS = AppPermissionsEnum;
  selectedLayer: any;
  link: any;
  axisLabelProps: any;
  yAxisLabelProps = [];
  chartTypes = ['bar', 'line', 'radar', 'polarArea'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<SelectIndicatorComponent>
  ) {}

  ngOnInit() {
    //console.log(this.dialogData);
    if (this.dialogData.length > 0) {
      const firstItemProperties = this.dialogData[0]?.properties;
      if (firstItemProperties) {
        this.axisLabelProps = Object.keys(firstItemProperties);
      }
    }
    this.form = this.fb.group({
      xAxisLabel: [undefined, Validators.required],
      yAxisLabel: [undefined, Validators.required],
      chartType: [this.chartTypes, Validators.required],
    });
  }

  save(): void {
    const { xAxisLabel, yAxisLabel, chartType } = this.form.getRawValue();

    //console.log(xAxisLabel, yAxisLabel, chartType);
    if (xAxisLabel && yAxisLabel && chartType) {
      //console.log('test');
      const chartData = {
        xAxisLabel: xAxisLabel,
        yAxisLabel: yAxisLabel,
        chartType: chartType,
      };
      this.dialogRef.close(chartData);
    }
  }
}
