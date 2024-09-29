import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DataApprovaDtoService } from '@core/api/services/data-approval-dto.service';
import {
  catchError,
  map,
  merge,
  startWith,
  switchMap,
  of as observableOf,
  take,
  tap,
} from 'rxjs';
import { IndicatorDtoService } from '@core/api/services/indicator-dto.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DataApprovalService } from '@core/api/services/data-approval.service';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { AutoUnsubscribe } from '@core/utils';
import { DatePipe } from '@angular/common';
@AutoUnsubscribe
@Component({
  selector: 'app-users',
  templateUrl: './data-approval.component.html',
  providers: [DatePipe],
})
export class DataApprovalComponent implements AfterViewInit {
  displayedColumns: string[] = [];
  indicators: any;
  form!: UntypedFormGroup;
  pageSize = 10;
  dataSource: MatTableDataSource<any>;
  isChecked!: boolean;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  PERMISSIONS = AppPermissionsEnum;
  activeOptions = ACTIVE_OPTIONS;

  constructor(
    private dataApprovaDtoService: DataApprovaDtoService,
    private dataApprovalService: DataApprovalService,
    private fb: UntypedFormBuilder,
    private indicatorDtoService: IndicatorDtoService,
    private datePipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngAfterViewInit() {
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
    // this.generateDataSource(null);
  }

  ngOnInit() {
    this.form = this.fb.group({
      indicator: [''],
    });
    this.form.get('indicator')?.valueChanges.subscribe((indicatorValue) => {
      this.generateDataSource(indicatorValue);
    });
  }

  generateDataSource(id: any) {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          const payload = {
            page: this.paginator.pageIndex,
            page_size: this.paginator.pageSize,
          };

          const indicatorId = id ? id : null;

          return this.dataApprovaDtoService
            .getDataApprovals(indicatorId, payload)
            .pipe(catchError(() => observableOf(null)));
        }),
        map((response) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = response === null;

          if (response === null) {
            return [];
          }

          this.resultsLength = response.count;

          if (this.resultsLength > 0) {
            // Generate displayedColumns dynamically based on keys of the first object in data.result
            const firstObject = response.result[0];
            const columnKeys = Object.keys(firstObject);

            // Ensure "id" column is placed first
            const idIndex = columnKeys.indexOf('id');
            if (idIndex !== -1) {
              columnKeys.splice(idIndex, 1);
              columnKeys.push('id');
            }

            // Exclude 'geom' column if present
            const geomIndex = columnKeys.indexOf('geom');
            if (geomIndex !== -1) {
              columnKeys.splice(geomIndex, 1);
            }

            this.displayedColumns = columnKeys;

            return response.result;
          } else if (this.resultsLength === 0) {
            // Generate displayedColumns dynamically based on keys of the first object in data.result
            const attribute_list = response?.attribute_list;

            // Exclude 'geom' column if present
            const columnKeys = Object.keys(attribute_list).filter(
              (key) => key !== 'geom'
            );

            this.displayedColumns = columnKeys;

            return response.result;
          }
        })
      )
      .subscribe((data) => (this.dataSource.data = data));
  }
  // Other methods remain unchanged
  formatDate(date: Date): string {
    // Use DatePipe to format the date to your desired format
    // Parse the original date string using moment.js

    // Convert the adjusted date to the desired format
    const convertedDate = this.datePipe.transform(date, 'dd/MM/yyyy') as string;

    return convertedDate;
  }
  toggleStatus(data: any) {
    const indicatorId = this.form.get('indicator')?.value;
    if (data?.accepted === false || data?.accepted === null) {
      const payload = {
        accepted: true,
      };

      this.dataApprovalService
        .createToggle(data?.id, indicatorId, payload)
        .pipe(
          take(1),
          tap((result) => {
            if (result) {
              this.refreshDataSource(indicatorId);
            }
          })
        )
        .subscribe();
    } else {
      const payload = {
        accepted: false,
      };
      this.dataApprovalService
        .createToggle(data?.id, indicatorId, payload)
        .pipe(
          take(1),
          tap((result) => {
            if (result) {
              this.refreshDataSource(indicatorId);
            }
          })
        )
        .subscribe();
    }
  }
  openImageInNewTab(imageUrl: string | undefined) {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  }
  deleteData(data: any) {
    const indicatorId = this.form.get('indicator')?.value;
    this.dataApprovalService
      .deleteDataApproval(indicatorId, data?.id)
      .pipe(
        take(1),
        tap((result) => {
          if (result) {
            this.refreshDataSource(indicatorId);
          }
        })
      )
      .subscribe();
  }
  refreshDataSource(indicatorId: any) {
    this.isLoadingResults = true;

    const payload = {
      page: this.paginator.pageIndex,
      page_size: this.paginator.pageSize,
    };

    this.dataApprovaDtoService
      .getDataApprovals(indicatorId, payload)
      .pipe(catchError(() => observableOf(null)))
      .subscribe((data) => {
        this.isLoadingResults = false;
        if (data === null) {
          return;
        }

        this.resultsLength = data.count;

        this.dataSource.data = data.result;
      });
  }
}
