import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class AttributeService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getAttributeById(id: any): Observable<any> {
    return this.http.get<any>(
      this.entityUrl + `/api/v1/attributemodelapi/${id}`
    );
  }
  createAttribute(payload: any): Observable<string> {
    return this.http.post<string>(
      this.entityUrl + '/api/v1/attributemodelapi/',
      payload
    );
  }
  updateAttribute(id?: any, payload?: any): Observable<boolean> {
    return this.http.put<boolean>(
      this.entityUrl + `/api/v1/attributemodelapi/${id}`,
      payload
    );
  }
  deleteAttribute(id: any): Observable<any> {
    return this.http.delete<any>(
      this.entityUrl + `/api/v1/attributemodelapi/${id}`
    );
  }
}
