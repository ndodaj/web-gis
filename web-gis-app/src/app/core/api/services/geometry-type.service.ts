import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class GeometryTypeService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getGeometryTypeById(id: any): Observable<any> {
    return this.http.get<any>(
      this.entityUrl + `/api/v1/geometrytypemodelapi/${id}`
    );
  }
  createGeometryType(payload: any): Observable<string> {
    return this.http.post<string>(
      this.entityUrl + '/api/v1/geometrytypemodelapi',
      payload
    );
  }
  updateGeometryType(id?: any, payload?: any): Observable<boolean> {
    return this.http.put<boolean>(
      this.entityUrl + `/api/v1/geometrytypemodelapi/${id}`,
      payload
    );
  }
  deleteGeometryType(id: any): Observable<any> {
    return this.http.delete<any>(
      this.entityUrl + `/api/v1/geometrytypemodelapi/${id}`
    );
  }
}
