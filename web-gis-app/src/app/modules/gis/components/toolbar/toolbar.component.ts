import { Component, ViewContainerRef } from '@angular/core';
import { AddDataComponent } from './buttons/add-data/add-data.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  items: any;
  constructor(private viewContainerRef: ViewContainerRef) {}

  public addTable(): void {
    this.viewContainerRef.createComponent(AddDataComponent);
  }
}
