import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public getRoles(): string[] {
    const apiRoles: string[] = []; // return roles from logged in user
    return apiRoles;
  }
}
