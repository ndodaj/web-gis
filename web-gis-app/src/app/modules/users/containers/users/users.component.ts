import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UserDtoService } from '@core/api/services/user-dto.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '@core/api/services/users.service';
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
import { CreateEditUserComponent } from '../../components/create-edit-user/create-edit-user.component';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { AutoUnsubscribe } from '@core/utils';
@AutoUnsubscribe
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class SearchUsersComponent implements AfterViewInit {
  PERMISSIONS = AppPermissionsEnum;
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'username',
    'email',
    'roles',
    'active',
    'actions',
  ];
  dataSource: MatTableDataSource<any>;
  activeOptions = ACTIVE_OPTIONS;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private userDtoService: UserDtoService,
    private usersService: UsersService,
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
            order_direction: this.sort.direction,
            page: this.paginator.pageIndex,
            page_size: this.paginator.pageSize,
          };
          return this.userDtoService
            .getUsers(payload)
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

    this.userDtoService
      .getUsers(payload)
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
      this.usersService
        .getUserById(data?.id)
        .pipe(
          take(1),
          tap((data: any) => {
            this.dialog
              .open(CreateEditUserComponent, {
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
          })
        )
        .subscribe();
    } else {
      this.dialog
        .open(CreateEditUserComponent, {
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

  deleteUser(data: any) {
    this.usersService
      .deleteUser(data?.id)
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
