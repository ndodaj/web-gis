import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@core/services/app-config.service';
import buildQuery, { QueryOptions } from 'odata-query';
import { Observable } from 'rxjs';
import { BaseService } from '../base-service';
import { OdataResponseModel } from '../models/odata-response-model';
import { PermissionDto } from '../models/permission-dto';

@Injectable({
  providedIn: 'root'
})
export class PermissionDtoService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getPermissions(
    query?: Partial<QueryOptions<PermissionDto>>
  ): Observable<OdataResponseModel<PermissionDto>> {
    return this.http.get<OdataResponseModel<PermissionDto>>(
      this.apiUrl + '/oData/Permissions' + buildQuery(query)
    );
  }
}
