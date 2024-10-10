import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { MapService } from '@shared/services/map.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layer-transaction',
  templateUrl: './layer-transaction.component.html',
})
export class LayerTransactionComponent {
  isUserLoggedIn!: boolean;
  items!: MenuItem[] | null;
  map = this.mapService.getMap();
  constructor(public mapService: MapService, public authService: AuthService) {
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }
}
