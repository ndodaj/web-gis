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
  take,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { DocumentDtoService } from '@core/api/services/document-dto.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ViewDocumentComponent } from 'src/app/modules/documents/components/view-document.component';
import { TypescriptUtils } from '@core/utils/typescript.utils';
import { AutoUnsubscribe } from '@core/utils';
@AutoUnsubscribe
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
})
export class DocumentComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'actions'];
  pageSize = 10;
  dataSource: MatTableDataSource<any>;
  isChecked!: boolean;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  isUserLoggedIn!: boolean;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private documentDtoService: DocumentDtoService,
    protected router: Router,
    public authService: AuthService,

    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit() {
    // if (this.isUserLoggedIn) {
    //   this.router.navigate(['documents/documents']);
    // } else {
    //   console.log('else');
    // }
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
          return this.documentDtoService
            .getDocuments(payload)
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

  viewDocument(data: any) {
    this.dialog
      .open(ViewDocumentComponent, { data, height: '500px' })
      .afterClosed()
      .pipe(
        take(1),
        tap(() => {})
      )
      .subscribe();
  }

  exportDocument(response: HttpResponse<Blob>, file: string): void {
    if (response.body) {
      const contentType = response?.headers?.get('content-type') as string;
      const fileName = response.headers
        ?.get('content-disposition')
        ?.split(';')[1]
        ?.split('filename')[1]
        ?.split('=')[1]
        ?.trim() as string;

      TypescriptUtils.downloadFile(
        response.body,
        fileName ? fileName : file,
        contentType
      );
    }
  }
  downloadFile(row: any) {
    console.log(row);

    const url = `localost:5000/static/uploads/${row?.name}`;
    this.http
      .get(url, { observe: 'response', responseType: 'blob' })
      .subscribe((response: any) => {
        this.exportDocument(response, row?.name);
      });
  }
  login() {
    this.router.navigateByUrl('/auth/login');
  }
}
