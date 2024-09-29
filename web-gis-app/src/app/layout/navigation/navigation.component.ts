import { Component } from '@angular/core';

import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  items = this.navigationService.items;

  constructor(private navigationService: NavigationService) {}
}
