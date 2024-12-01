import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndicatorCategoryDtoService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getIndicatorCategories(
    workspaceName?: string,
    payload?: any
  ): Observable<any> {
    return this.http.get<any>(
      this.apiUrl +
        `/geoserver/layergroups?workspaceName=${workspaceName}&page=${payload?.page}&size=${payload?.size}&sort=${payload?.sort[0]}`
    );
  }

  getLayerGroupsByName(
    layerGroupName?: string,
    workspaceName?: string
  ): Observable<any> {
    return this.http.get<any>(
      this.apiUrl +
        `/geoserver/layergroups/${layerGroupName}?workspaceName=${workspaceName}`
    );
  }
}
