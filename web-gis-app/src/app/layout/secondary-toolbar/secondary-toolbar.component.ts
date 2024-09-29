import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-secondary-toolbar',
  templateUrl: './secondary-toolbar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./secondary-toolbar.component.scss']
})
export class SecondaryToolbarComponent {
  @Input() title!: string | null | undefined;
}
