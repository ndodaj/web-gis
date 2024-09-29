import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class IndicatorCategoryService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getIndicatorCategoryById(id: any): Observable<any> {
    return this.http.get<any>(
      this.entityUrl + `/api/v1/indicatorcategorymodelapi/${id}`
    );
  }
  createIndicatorCategory(payload: any): Observable<string> {
    return this.http.post<string>(
      this.entityUrl + '/api/v1/indicatorcategorymodelapi/',
      payload
    );
  }
  updateIndicatorCategory(id?: any, payload?: any): Observable<boolean> {
    return this.http.put<boolean>(
      this.entityUrl + `/api/v1/indicatorcategorymodelapi/${id}`,
      payload
    );
  }
  deleteIndicatorCategory(id: any): Observable<any> {
    return this.http.delete<any>(
      this.entityUrl + `/api/v1/indicatorcategorymodelapi/${id}`
    );
  }
}
