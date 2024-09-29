// data-source.service.ts

import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataSourceService<T> {
  private dataSource: MatTableDataSource<T> | null = null;
  private subscription: Subscription | null = null;
  protected readonly dataSubject: BehaviorSubject<T[]> = new BehaviorSubject<
    T[]
  >([]);
  constructor() {}

  setDataSource(dataSource: MatTableDataSource<T>): void {
    this.dataSource = dataSource;
  }

  setPaginator(paginator: MatPaginator): void {
    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  filterData(filterValue: any): void {
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
  setSort(sort: MatSort): void {
    if (this.dataSource) {
      this.dataSource.sort = sort;
    }
  }

  refresh(data: T[]): void {
    if (this.dataSource) {
      this.dataSource.data = data;
      this.triggerUpdate();
    }
  }

  private triggerUpdate(): void {
    if (this.dataSource && Array.isArray(this.dataSource.data)) {
      this.dataSource.data = [...this.dataSource.data]; // Try without slice
    } else {
      console.error('Data is not an array or MatTableDataSource is not set.');
      // Handle the case where data is not an array or MatTableDataSource is not set
    }
  }

  connect(observable: Observable<T[]>): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = observable.subscribe(
      (data) => {
        this.refresh(data);
      },
      (error) => {
        console.error('Error in Observable:', error);
      }
    );
  }

  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get data() {
    return this.dataSubject.value;
  }
}
