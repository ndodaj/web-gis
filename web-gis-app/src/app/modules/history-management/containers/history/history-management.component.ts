import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IndicatorDtoService } from '@core/api/services/indicator-dto.service';
import { AutoUnsubscribe } from '@core/utils';
import { DatePipe } from '@angular/common';
@AutoUnsubscribe
@Component({
  selector: 'app-users',
  templateUrl: './history-management.component.html',
  providers: [DatePipe],
})
export class HistoryManagementComponent implements AfterViewInit {
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
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dataApprovaDtoService: DataApprovaDtoService,
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
      // Perform data retrieval based on the selected indicator value
      // For example:
      // Call a service method to fetch data using the indicatorValue
      // Update this.dataSource.data with the retrieved data
      console.log('Selected indicator value:', indicatorValue);
      this.generateDataSource(indicatorValue);
    });
  }

  generateDataSource(id: any) {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
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
              columnKeys.unshift('id');
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

  openImageInNewTab(imageUrl: string | undefined) {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  }
  // Other methods remain unchanged

  formatDate(date: Date): string {
    // Use DatePipe to format the date to your desired format
    // Parse the original date string using moment.js

    // Convert the adjusted date to the desired format
    const convertedDate = this.datePipe.transform(date, 'dd/MM/yyyy') as string;

    return convertedDate;
  }
}
