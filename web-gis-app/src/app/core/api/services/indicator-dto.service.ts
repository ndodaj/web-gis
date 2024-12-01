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

  getIndicators1(workspaceName?: string, payload?: any): Observable<any> {
    let params = new HttpParams();
    payload = {
      order_column: payload?.order_column,
      order_direction: payload?.order_direction,
      page: payload?.page,
      page_size: payload?.page_size,
    };
    params = params.append('q', JSON.stringify(payload));
    console.log(params);

    if (payload === undefined) {
      return this.http.get<any>(this.apiUrl + 'geoserver/layers');
    } else {
      return this.http.get<any>(
        this.apiUrl +
          `/geoserver/layers?workspaceName=${workspaceName}&page=${0}`
      );
    }
  }

  getIndicators(workspaceName?: string, payload?: any): Observable<any> {
    console.log(workspaceName, payload?.sort[0]);

    return this.http.get<any>(
      this.apiUrl +
        `/geoserver/layers?workspaceName=${workspaceName}&page=${payload?.page}&size=${payload?.size}&sort=${payload?.sort[0]}`
    );
  }

  getLayers(payload?: any): Observable<any> {
    console.log(payload);

    return this.http.get<any>(
      this.apiUrl +
        `/geoserver/layers?page=${payload?.page}&size=${payload?.size}&sort=${payload?.sort[0]}`
    );
  }
}
