import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IndicatorCategoryDtoService } from '@core/api/services/indicator-category-dto.service';
import { IndicatorCategoryService } from '@core/api/services/indicator-category.service';
import {
  catchError,
  map,
  merge,
  startWith,
  switchMap,
  take,
  tap,
  of as observableOf,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditIndicatorCategoryComponent } from '../../components/create-edit-indicator-category/create-edit-indicator-category.component';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { AutoUnsubscribe } from '@core/utils';
@AutoUnsubscribe
@Component({
  selector: 'app-indicator-category',
  templateUrl: './indicator-category.component.html',
})
export class IndicatorCategoryComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'indicators',
    // 'accepted',
    // 'created_by',
    // 'created_on',
    // 'changed_by',
    // 'changed_on',
    'actions',
  ];
  dataSource: MatTableDataSource<any>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  PERMISSIONS = AppPermissionsEnum;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private indicatorCategoryDtoService: IndicatorCategoryDtoService,
    private indicatorCategoryService: IndicatorCategoryService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          const payload = {
            order_column: 'created_on',
            order_direction: this.sort.direction,
            page: this.paginator.pageIndex,
            page_size: this.paginator.pageSize,
          };
          return this.indicatorCategoryDtoService
            .getIndicatorCategories(payload)
            .pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.count;

          return data.result;
        })
      )
      .subscribe((data) => (this.dataSource.data = data));
  }

  refreshDataSource() {
    this.isLoadingResults = true;

    const payload = {
      order_column: 'created_on',
      order_direction: this.sort.direction,
      page: this.paginator.pageIndex,
      page_size: this.paginator.pageSize,
    };

    this.indicatorCategoryDtoService
      .getIndicatorCategories(payload)
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateEditModal(data?: any): void {
    if (data) {
      this.indicatorCategoryService
        .getIndicatorCategoryById(data?.id)
        .pipe(
          take(1),
          tap((data: any) => {
            this.dialog
              .open(CreateEditIndicatorCategoryComponent, {
                data: data,
              })
              .afterClosed()
              .pipe(
                take(1),
                tap((result: boolean) => {
                  if (result) {
                    this.refreshDataSource();
                  }
                })
              )
              .subscribe();
          })
        )
        .subscribe();
    } else {
      this.dialog
        .open(CreateEditIndicatorCategoryComponent, {
          data,
        })
        .afterClosed()
        .pipe(
          take(1),
          tap((result: boolean) => {
            if (result) {
              this.refreshDataSource();
            }
          })
        )
        .subscribe();
    }
  }

  deleteCategory(data: any) {
    this.indicatorCategoryService
      .deleteIndicatorCategory(data?.id)
      .pipe(
        take(1),
        tap((value) => {
          if (value) {
            this.refreshDataSource();
          }
        })
      )
      .subscribe();
  }
  toggleStatus(data: any) {
    if (data?.accepted === false || data?.accepted === null) {
      const payload = {
        accepted: true,
      };
      this.indicatorCategoryService
        .updateIndicatorCategory(data?.id, payload)
        .pipe(
          take(1),
          tap((result) => {
            if (result) {
              this.refreshDataSource();
            }
          })
        )
        .subscribe();
    } else {
      const payload = {
        accepted: false,
      };
      this.indicatorCategoryService
        .updateIndicatorCategory(data?.id, payload)
        .pipe(
          take(1),
          tap((result) => {
            if (result) {
              this.refreshDataSource();
            }
          })
        )
        .subscribe();
    }
  }
}
