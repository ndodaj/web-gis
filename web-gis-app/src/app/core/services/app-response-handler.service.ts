import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MonoTypeOperatorFunction,
  Observable,
  Subscriber,
  throwError,
} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AppErrorResponse } from '../models/app-error-response';
import {
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { TypescriptUtils } from '@core/utils/typescript.utils';

@Injectable({ providedIn: 'root' })
export class AppResponseHandlerService {
  private MESSAGE_TIMEOUT = 1500;
  private MESSAGE_DURATION = this.MESSAGE_TIMEOUT + 500;
  constructor(private snackBarService: MatSnackBar) {}

  handleSuccessMessage<R>(callback: () => string): MonoTypeOperatorFunction<R> {
    return (obs) => obs.pipe(tap(() => this.showMessage(callback())));
  }

  handleDocumentExport(): MonoTypeOperatorFunction<HttpResponse<Blob>> {
    return (obs) => obs.pipe(tap((response) => this.exportDocument(response)));
  }

  handleErrorMessage<R>(): MonoTypeOperatorFunction<R> {
    return (obs) =>
      obs.pipe(
        catchError((httpError: AppErrorResponse) => {
          return this.isBlobError(httpError)
            ? this.parseErrorBlob(httpError)
            : throwError(() => httpError);
        }),
        catchError((httpError: AppErrorResponse) => {
          if (httpError.status !== HttpStatusCode.Unauthorized) {
            const messages = (httpError.error?.message as string) || [
              httpError.message,
            ];

            if (Array.isArray(messages)) {
              messages.forEach((message, index) => {
                setTimeout(() => {
                  this.showMessage(message);
                }, index * this.MESSAGE_DURATION);
              });
            } else {
              this.showMessage(messages as string);
            }
          }
          return throwError(() => httpError);
        })
      );
  }

  isBlobError(err: AppErrorResponse) {
    return (
      err instanceof HttpErrorResponse &&
      err.error instanceof Blob &&
      err.error.type === 'application/json'
    );
  }

  parseErrorBlob(err: AppErrorResponse): Observable<never> {
    const reader: FileReader = new FileReader();
    const obs = new Observable((observer: Subscriber<never>) => {
      reader.onloadend = () => {
        observer.error(
          new HttpErrorResponse({
            ...(err as any),
            error: JSON.parse(reader.result as string),
          })
        );
        observer.complete();
      };
    });
    reader.readAsText(err.error);
    return obs;
  }

  private showMessage(message: string): void {
    this.snackBarService.open(message, 'Close', {
      duration: this.MESSAGE_TIMEOUT,
    });
  }

  private exportDocument(response: HttpResponse<Blob>): void {
    if (response.body) {
      const contentType = response?.headers?.get('content-type') as string;
      const fileName = response.headers
        ?.get('content-disposition')
        ?.split(';')[1]
        ?.split('filename')[1]
        ?.split('=')[1]
        ?.trim() as string;
      TypescriptUtils.downloadFile(response.body, fileName, contentType);
    }
  }
}
