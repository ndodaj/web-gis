import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayerGroupsDtoService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  getLayerGroups(): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + '/geoserver/layergroup/layer-groups'
    );
  }
}
