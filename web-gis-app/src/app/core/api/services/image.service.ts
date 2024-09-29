import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getDocumentById(id: any): Observable<any> {
    return this.http.get<any>(this.entityUrl + `/api/v1/documents/${id}`);
  }
  uploadDocument(payload: any, id: any): Observable<string> {
    return this.http.post<string>(
      this.entityUrl + `/api/v1/images/${id}`,
      payload
    );
  }
  upload(payload: any, indicatorId: any, recordId: any): Observable<string> {
    return this.http.post<string>(
      this.entityUrl + `/api/v1/data/by_name/${indicatorId}/${recordId}/image`,
      payload
    );
  }
  updateDocument(id?: any, payload?: any): Observable<boolean> {
    return this.http.put<boolean>(
      this.entityUrl + `/api/v1/documents/${id}`,
      payload
    );
  }
  deleteDocument(id: any): Observable<any> {
    return this.http.delete<any>(this.entityUrl + `/api/v1/documents/${id}`);
  }

  downloadDocument(file: any): Observable<HttpResponse<Blob>> {
    return this.http.get(this.entityUrl + `static/uploads/${file}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
