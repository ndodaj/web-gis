import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { NavigationItem } from '../models/navigation-item';
import { NavigationLink } from '../models/navigation-link';
import { NavigationSubheading } from '../models/navigation-subheading';
import { NavigationDropdown } from '../models/navigation-dropdown';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private _items: NavigationItem[] = [];

  public get items() {
    return this._items;
  }

  public set items(items: NavigationItem[]) {
    const menu = [...items];
    menu.forEach((child) => {
      if (child.type == 'dropdown') {
        child.anyPermission = child.children.some((item) => !item.anyPermission)
          ? undefined
          : (child.children
              .map((item) =>
                Array.isArray(item.anyPermission)
                  ? item.anyPermission
                  : [item.anyPermission]
              )
              .reduce((a, b) => {
                return a.concat(b);
              }, []) as string[]);
      }
    });

    this._items = menu;
  }

  private _openChangeSubject = new Subject<NavigationDropdown>();
  openChange$ = this._openChangeSubject.asObservable();

  triggerOpenChange(item: NavigationDropdown) {
    this._openChangeSubject.next(item);
  }

  isLink(item: NavigationItem): item is NavigationLink {
    return item.type === 'link';
  }

  isDropdown(item: NavigationItem): item is NavigationDropdown {
    return item.type === 'dropdown';
  }

  isSubheading(item: NavigationItem): item is NavigationSubheading {
    return item.type === 'subheading';
  }
}
