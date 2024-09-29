import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

import buildQuery, { QueryOptions } from 'odata-query';
import { Observable } from 'rxjs';
import { RolesDto } from '../models/roles-dto';

@Injectable({
  providedIn: 'root'
})
export class RolesOdataService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getRoles(
    query?: Partial<QueryOptions<RolesDto>>
  ): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + '/oData/Roles' + buildQuery(query)
    );
  }
}
