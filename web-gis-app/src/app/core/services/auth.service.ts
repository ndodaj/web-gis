import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  CanMatchFn,
  Router,
} from '@angular/router';
import { permissions } from 'src/assets/api/permissions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private permissionsUrl = 'assets/api/users.json';
  //currentUser$ = this.accountService.getCurrentUser().subscribe();
  constructor(private router: Router) {}

  public logout = (withRedirectToLogin = true): void => {
    environment.cacheStorage.removeItem(
      environment.loggedInUserCacheStorageKey
    );
    environment.cacheStorage.removeItem(
      environment.loggedInUserCacheStorageKeyRole!
    );
    if (withRedirectToLogin) {
      this.router.navigate(['auth', 'login']);
    }
  };

  public isLoggedIn(): boolean {
    const currentUserLoggedInAccount = this.getUserLoggedInAccount();
    if (currentUserLoggedInAccount?.access_token) {
      return true;
    }

    return false;
  }

  public getUserLoggedInAccount = (): any =>
    JSON.parse(
      environment.cacheStorage.getItem(
        environment.loggedInUserCacheStorageKey
      ) || '{}'
    );

  public getUserLoggedInRoles = (): any =>
    JSON.parse(
      environment.cacheStorage.getItem(
        environment.loggedInUserCacheStorageKeyRole!
      ) || '{}'
    );

  public setUserLoggedInAccount = (response: any): void => {
    environment.cacheStorage.setItem(
      environment.loggedInUserCacheStorageKey,
      JSON.stringify(response)
    );
  };

  public setUserLoggedInRoles = (response: any): void => {
    environment.cacheStorage.setItem(
      environment.loggedInUserCacheStorageKeyRole!,
      JSON.stringify(response?.permissions)
    );
  };

  /**
   * Return the claim value  of an encoded token in base64Url.
   *
   * @param jwt Token encoded in base64Url.
   *
   * @param claimPropertyName Name of claim we want to retrive the value.
   *
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getDecodedTokenClaim(claimPropertyName: string): any {
    const result = this.getUserLoggedInAccount()
      ?.access_token?.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    if (typeof result !== 'string') {
      throw new Error('Invalid token specified!');
    }

    let decoded: string;

    try {
      decoded = this.decodeBase64UrlText(result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error('Invalid base64 token specified: ' + err?.message);
    }

    try {
      return JSON.parse(decoded)[claimPropertyName];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error('Invalid json token specified: ' + err?.message);
    }
  }

  /**
   * Return the decoded string  of an encoded component in base64Url.
   *
   * @param componentStr Encoded URI component
   *
   * @returns string - the decoded version of an encoded component in base64Url.
   *
   */
  private decodeBase64UrlText(componentStr: string): string {
    const result = componentStr.replace(/-/g, '+').replace(/_/g, '/');
    try {
      return decodeURIComponent(
        atob(result)?.replace(/(.)/g, (_, p) => {
          let code = p.charCodeAt(0)?.toString(16)?.toUpperCase();
          if (code?.length < 2) {
            code = '0' + code;
          }

          return '%' + code;
        })
      );
    } catch (err) {
      return atob(result);
    }
  }
  getPermissionsByRoleId(roleId: number): any {
    const permissionsUnknown: unknown = permissions;
    const rolePermissions = (
      permissionsUnknown as { [key: number]: { [key: string]: string }[] }
    )[roleId];
    if (rolePermissions) {
      return rolePermissions.map((permission) => Object.values(permission)[0]);
    } else {
      return []; // or handle the case where rolePermissions is not found
    }
  }

  hasAnyPermission(code: string[] | undefined | string): boolean {
    const permissions = this.getUserLoggedInRoles();

    if (code) {
      const appPermissions = Array.isArray(code) ? code : [code];
      //todo : add const id = this.getUserLoggedInRoles();
      const userPermissions: any = Object.values(permissions);

      return appPermissions?.some((ar) => userPermissions?.includes(ar));
    }
    return true;
  }
}
export const AuthGuard: CanActivateFn | CanActivateChildFn = (): boolean => {
  return inject(AuthService).isLoggedIn();
};

export const HasAnyPermissionGuard:
  | CanActivateFn
  | CanActivateChildFn
  | CanMatchFn = (route: ActivatedRouteSnapshot): boolean => {
  return inject(AuthService).hasAnyPermission(route?.data?.anyPermission);
};
