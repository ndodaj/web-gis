import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class DataApprovalService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getDataApprovalsById(id: any): Observable<any> {
    return this.http.get<any>(
      this.entityUrl + `/api/v1/attributeinstancemodelapi/${id}`
    );
  }
  createToggle(id: any, indicatorId: any, payload: any): Observable<string> {
    return this.http.put<string>(
      this.entityUrl + `/api/v1/data/${indicatorId}/${id}`,
      payload
    );
  }
  updateDataApproval(id?: any, payload?: any): Observable<boolean> {
    return this.http.put<boolean>(
      this.entityUrl + `/api/v1/attributeinstancemodelapi/${id}`,
      payload
    );
  }
  deleteDataApproval(indicatorId: any, id: any): Observable<any> {
    return this.http.delete<any>(
      this.entityUrl + `/api/v1/data/${indicatorId}/${id}`
    );
  }
}
