import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
import { AttributeDtoService } from '@core/api/services/attribute-dto.service';
import { CreateEditAttributeComponent } from '../../components/create-edit-attribute/create-edit-attribute.component';
import { AttributeService } from '@core/api/services/attribute.service';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { AutoUnsubscribe } from '@core/utils';
@AutoUnsubscribe
@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
})
export class AttributesComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'indicator',
    'data_type',
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
    private attributeDtoService: AttributeDtoService,
    private attributeService: AttributeService,
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
            order_column: 'id',
            order_direction: this.sort.direction,
            page: this.paginator.pageIndex,
            page_size: this.paginator.pageSize,
          };
          return this.attributeDtoService
            .getAttributes(payload)
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

    this.attributeDtoService
      .getAttributes(payload)
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

  openCreateEditModal(data?: any): void {
    if (data) {
      this.attributeService
        .getAttributeById(data?.id)
        .pipe(
          take(1),
          tap((data: any) => {
            this.dialog
              .open(CreateEditAttributeComponent, {
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
        .open(CreateEditAttributeComponent, {
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

  deleteAttribute(data: any) {
    this.attributeService
      .deleteAttribute(data?.id)
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

  toggleStatus(data: any) {
    if (data?.accepted === false || data?.accepted === null) {
      const payload = {
        accepted: true,
      };
      this.attributeService
        .updateAttribute(data?.id, payload)
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
      this.attributeService
        .updateAttribute(data?.id, payload)
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
