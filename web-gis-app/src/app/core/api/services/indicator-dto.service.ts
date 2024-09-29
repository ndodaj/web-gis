import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndicatorDtoService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getIndicators(payload?: any): Observable<any> {
    let params = new HttpParams();
    payload = {
      order_column: payload?.order_column,
      order_direction: payload?.order_direction,
      page: payload?.page,
      page_size: payload?.page_size,
    };
    params = params.append('q', JSON.stringify(payload));
    if (payload === undefined) {
      return this.http.get<any>(this.apiUrl + '/api/v1/indicatormodelapi/');
    } else {
      return this.http.get<any>(this.apiUrl + '/api/v1/indicatormodelapi/', {
        params,
      });
    }
  }
}
