import { Component, Input } from '@angular/core';

import { BreadcrumbItem } from '@core/models/breadcrumb-item';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input() crumbs: BreadcrumbItem[] = [];

  trackByValue(_: number, value: BreadcrumbItem) {
    return value.id;
  }
}
