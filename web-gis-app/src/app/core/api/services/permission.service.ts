import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

import { Observable } from 'rxjs';
import { PermissionDto } from '../models/permission-dto';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getPermissionsGroupedByResource(): Observable<any[]> {
    return this.http.get<any[]>(
      this.entityUrl + '/Permission/GetAllPermissionsGroupedByResource'
    );
  }

  updatePermission(payload: any): Observable<void> {
    return this.http.put<void>(this.entityUrl + '/Permission/Update', payload);
  }

  getPermissionById(id: string): Observable<PermissionDto> {
    return this.http.get<PermissionDto>(
      this.entityUrl + `/Permission/GetById?id=${id}`
    );
  }
}
