import { Component, Input } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { GetInfoService } from '@shared/services/get-info/get-info.service';
import { MapService } from '@shared/services/map.service';
import { SaveToLayerService } from '@shared/services/save-to-layer/save-to-layer.service';

import { Draw } from 'ol/interaction';

@Component({
  selector: 'app-save-to-layer',
  templateUrl: './save-to-layer.component.html',
})
export class SaveToLayerComponent {
  isUserLoggedIn!: boolean;
  layerName!: any;
  workspace!: any;
  geometryType!: any;
  source!: any;
  layerType!: any;
  formattedCoordinates!: any;
  body!: any;
  url!: any;
  layerTitle!: any;
  selectedLayerGroup!: any;
  layerGroup!: any;
  layerParam!: any;
  draw!: Draw;
  @Input() selectedLayer!: any;
  @Input() buttonType = 'button';

  map = this.mapService.getMap();
  constructor(
    public mapService: MapService,
    public authService: AuthService,
    private saveToLayerService: SaveToLayerService,
    private getInfoService: GetInfoService
  ) {
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  activate(event: any) {
    this.mapService.getMap().removeInteraction(this.draw);

    this.selectedLayer = this.mapService.layerSwitcher.getSelection();

    if (event && !this.selectedLayer) {
      alert('Please select a indicator first.');
      return;
    } else if (event && this.selectedLayer) {
      this.mapService
        .getMap()
        .un('singleclick', this.getInfoService.singleClick);
      const source = this.selectedLayer.getSource();
      this.saveToLayerService.saveToLayer(this.selectedLayer, source);
    }
  }
}
