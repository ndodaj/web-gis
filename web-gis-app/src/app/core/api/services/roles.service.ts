import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateRoles } from '../models/create-roles';
import { EditRoles } from '../models/edit-roles';
import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  createRole(payload: CreateRoles): Observable<string> {
    return this.http.post<string>(this.entityUrl + '/Role/CreateRole', payload);
  }
  updateRole(payload: EditRoles): Observable<boolean> {
    return this.http.put<boolean>(this.entityUrl + '/Role/EditRole', payload);
  }

  getRoleById(id: string): Observable<any> {
    return this.http.get<any>(this.entityUrl + `/Role/GetRole/${id}`);
  }
}
