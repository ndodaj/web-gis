import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class IndicatorService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getIndicatorById(id: any): Observable<any> {
    return this.http.get<any>(
      this.entityUrl + `/api/v1/indicatormodelapi/${id}`
    );
  }
  createIndicator(payload: any): Observable<string> {
    return this.http.post<string>(
      this.entityUrl + '/api/v1/indicatormodelapi/',
      payload
    );
  }
  updateIndicator(id?: any, payload?: any): Observable<boolean> {
    return this.http.put<boolean>(
      this.entityUrl + `/api/v1/indicatormodelapi/${id}`,
      payload
    );
  }
  deleteIndicator(id: any): Observable<any> {
    return this.http.delete<any>(
      this.entityUrl + `/api/v1/indicatormodelapi/${id}`
    );
  }
}
