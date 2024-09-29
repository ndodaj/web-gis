import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { RolesDto } from '@core/api/models/roles-dto';
import { RolesService } from '@core/api/services/roles.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRoleResolverService implements Resolve<RolesDto> {
  constructor(private rolesService: RolesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<RolesDto> {
    const roleId = route.paramMap.get('id')!;
    return this.rolesService.getRoleById(roleId);
  }
}
