import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base-service';
import { AppConfigService } from '@core/services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends BaseService {
  constructor(private http: HttpClient, config: AppConfigService) {
    super(config);
  }

  login(payload: any): Observable<any> {
    return this.http.post<any>(
      this.entityUrl + '/api/v1/security/login',
      payload
    );
  }
  // Method to fetch permissions for a specific role
  getRolePermissions(roleId: number): Observable<any[]> {
    return this.http.get<any[]>(
      this.entityUrl + `/api/v1/security/roles/${roleId}/permissions`
    );
  }

  signUp(payload: any): Observable<any> {
    return this.http.post<any>(
      this.entityUrl + '/api/v1/security/register',
      payload
    );
  }

  refreshToken(payload: any): Observable<any> {
    return this.http.post<any>(
      this.entityUrl + '/api/v1/security-extended/refresh',
      payload
    );
  }

  changeOwnPassword(payload: any): Observable<boolean> {
    return this.http.post<boolean>(
      this.entityUrl + '/Account/ChangeOwnPassword',
      payload
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(this.entityUrl + '/api/v1/currentuser/');
  }
}
