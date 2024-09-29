import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppResponseHandlerService } from '../services/app-response-handler.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private appResponseHandlerService: AppResponseHandlerService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)
      .pipe(this.appResponseHandlerService.handleErrorMessage());
  }
}
