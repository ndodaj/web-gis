import { SimpleChanges } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { dropdownAnimation } from '@shared/animations/dropdown.animation';
import { NavigationDropdown } from '@core/models/navigation-dropdown';
import { NavigationItem } from '@core/models/navigation-item';
import { NavigationLink } from '@core/models/navigation-link';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss'],
  animations: [dropdownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavItemComponent implements OnInit, OnChanges {
  @Input() item!: NavigationItem;
  @Input() level!: number;
  isOpen!: boolean;
  isActive!: boolean;

  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private navigationService: NavigationService
  ) {}

  @HostBinding('class')
  get levelClass() {
    return `item-level-${this.level}`;
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter(() => this.isDropdown(this.item))
      )
      .subscribe(() => this.onRouteChange());

    this.navigationService.openChange$
      .pipe(filter(() => this.isDropdown(this.item)))
      .subscribe((item) => this.onOpenChange(item));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      Object.prototype.hasOwnProperty.call(changes, 'item') &&
      this.isDropdown(this.item)
    ) {
      this.onRouteChange();
    }
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
    this.navigationService.triggerOpenChange(this.item as NavigationDropdown);
    this.cd.markForCheck();
  }

  onOpenChange(item: NavigationDropdown) {
    if (this.isChildrenOf(this.item as NavigationDropdown, item)) {
      return;
    }

    if (this.hasActiveChilds(this.item as NavigationDropdown)) {
      return;
    }

    if (this.item !== item) {
      this.isOpen = false;
      this.cd.markForCheck();
    }
  }

  onRouteChange() {
    if (this.hasActiveChilds(this.item as NavigationDropdown)) {
      this.isActive = true;
      this.isOpen = true;
      this.navigationService.triggerOpenChange(this.item as NavigationDropdown);
      this.cd.markForCheck();
    } else {
      this.isActive = false;
      this.isOpen = false;
      this.navigationService.triggerOpenChange(this.item as NavigationDropdown);
      this.cd.markForCheck();
    }
  }

  isChildrenOf(parent: NavigationDropdown, item: NavigationDropdown): boolean {
    if (parent.children.indexOf(item) !== -1) {
      return true;
    }

    return parent.children
      .filter((child) => this.isDropdown(child))
      .some((child) => this.isChildrenOf(child as NavigationDropdown, item));
  }

  hasActiveChilds(parent: NavigationDropdown): boolean {
    return parent.children.some((child) => {
      if (this.isDropdown(child)) {
        return this.hasActiveChilds(child);
      }

      if (this.isLink(child) && !this.isFunction(child.route)) {
        return this.router.isActive(child.route as string, false);
      }
      return false;
    });
  }

  isFunction(prop: NavigationLink['route']) {
    return prop instanceof Function;
  }
}
