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
  of as observableOf,
} from 'rxjs';
import { GeometryTypeDtoService } from '@core/api/services/geometry-type-dto.service';

@Component({
  selector: 'app-geometry-types',
  templateUrl: './geometry-types.component.html',
})
export class GeometryTypesComponent implements AfterViewInit {
  displayedColumns: string[] = ['type'];
  dataSource: MatTableDataSource<any>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private geometryTypeDtoService: GeometryTypeDtoService) {
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
            order_direction: this.sort.direction,
            page: this.paginator.pageIndex,
            page_size: this.paginator.pageSize,
          };
          return this.geometryTypeDtoService
            .getGeometryTypes(payload)
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
      order_direction: this.sort.direction,
      page: this.paginator.pageIndex,
      page_size: this.paginator.pageSize,
    };

    this.geometryTypeDtoService
      .getGeometryTypes(payload)
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
}
