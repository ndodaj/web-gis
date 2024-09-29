import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { AccountService } from '@core/api/services/account.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(this.attachTokenAsHeader(request)).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === HttpStatusCode.Unauthorized &&
          this.authService.isLoggedIn()
        ) {
          return this.handleRefreshToken(request, next);
        }

        return throwError(error);
      })
    );
  }

  private attachTokenAsHeader(request: HttpRequest<unknown>) {
    const token = this.authService.getUserLoggedInAccount()?.access_token;
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return request;
  }

  private handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler) {
    return this.accountService
      .refreshToken({
        refresh_token: this.authService.getUserLoggedInAccount()?.refresh_token,
        access_token: this.authService.getUserLoggedInAccount()?.access_token,
      })
      .pipe(
        switchMap((response) => {
          this.authService.setUserLoggedInAccount(response);
          return next.handle(this.attachTokenAsHeader(request));
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true,
};
