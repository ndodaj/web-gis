import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private _sidenavOpenSubject = new BehaviorSubject<boolean>(false);
  sidenavOpen$ = this._sidenavOpenSubject.asObservable();

  private _sidenavCollapsedSubject = new BehaviorSubject<boolean>(false);
  sidenavCollapsed$ = this._sidenavCollapsedSubject.asObservable();

  private _sidenavCollapsedOpenSubject = new BehaviorSubject<boolean>(false);
  sidenavCollapsedOpen$ = this._sidenavCollapsedOpenSubject.asObservable();

  isDesktop$ = this.breakpointObserver
    .observe(`(min-width: 1280px)`)
    .pipe(map((state) => state.matches));

  constructor(private breakpointObserver: BreakpointObserver) {}

  openSidenav() {
    this._sidenavOpenSubject.next(true);
  }

  collapseSidenav() {
    this._sidenavCollapsedSubject.next(true);
  }
  expandSidenav() {
    this._sidenavCollapsedSubject.next(false);
  }

  collapseOpenSidenav() {
    this._sidenavCollapsedOpenSubject.next(true);
  }

  collapseCloseSidenav() {
    this._sidenavCollapsedOpenSubject.next(false);
  }
}
