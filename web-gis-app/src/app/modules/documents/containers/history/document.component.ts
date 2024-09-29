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
import { MatDialog } from '@angular/material/dialog';
import { UploadFileComponent } from '../../components/upload-file.component';
import { DocumentDtoService } from '@core/api/services/document-dto.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TypescriptUtils } from '@core/utils/typescript.utils';
import { DocumentService } from '@core/api/services/document.service';
import { ViewDocumentComponent } from '../../components/view-document.component';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { AutoUnsubscribe } from '@core/utils';
@AutoUnsubscribe
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
})
export class DocumentComponent implements AfterViewInit {
  PERMISSIONS = AppPermissionsEnum;
  displayedColumns: string[] = ['name', 'actions'];
  pageSize = 10;
  dataSource: MatTableDataSource<any>;
  isChecked!: boolean;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private documentDtoService: DocumentDtoService,

    private dialog: MatDialog,
    private http: HttpClient,
    private documentService: DocumentService
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

  refreshDataSource() {
    this.isLoadingResults = true;

    const payload = {
      order_column: 'created_on',
      order_direction: this.sort.direction,
      page: this.paginator.pageIndex,
      page_size: this.paginator.pageSize,
    };

    this.documentDtoService
      .getDocuments(payload)
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
  openFileUpload(data?: any) {
    if (data) {
      this.documentService
        .getDocumentById(data?.id)
        .pipe(
          take(1),
          tap((data: any) => {
            this.dialog
              .open(UploadFileComponent, {
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
        .open(UploadFileComponent, {})
        .afterClosed()
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

  viewDocument(data: any) {
    this.dialog
      .open(ViewDocumentComponent, { data, height: '500px' })
      .afterClosed()
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
    const url = `localhost:5000/static/uploads/${row?.name}`;

    this.http
      .get(url, { observe: 'response', responseType: 'blob' })
      .subscribe((response: any) => {
        this.exportDocument(response, row?.name);
      });
  }
  deleteDocument(data: any) {
    this.documentService
      .deleteDocument(data?.id)
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
