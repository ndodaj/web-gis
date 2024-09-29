import { Component, Input } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { EditLayerService } from '@shared/services/edit-layer/edit-layer.service';
import { MapService } from '@shared/services/map.service';

import { Draw, Modify } from 'ol/interaction';

@Component({
  selector: 'app-edit-layer',
  templateUrl: './edit-layer.component.html',
})
export class EditLayerComponent {
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
  @Input() buttonType = 'mat-icon';

  map = this.mapService.getMap();
  constructor(
    public mapService: MapService,
    public authService: AuthService,
    private editLayerService: EditLayerService
  ) {
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  activate(event: any) {
    this.mapService
      .getMap()
      .getInteractions()
      .forEach((interaction) => {
        if (interaction instanceof Draw) {
          this.mapService.getMap().removeInteraction(interaction);
        } else if (interaction instanceof Modify) {
          this.mapService.getMap().removeInteraction(interaction);
        }
      });

    this.selectedLayer = this.mapService.layerSwitcher.getSelection();

    if (event && !this.selectedLayer) {
      alert('Please select a indicator first.');
      return;
    } else if (event && this.selectedLayer) {
      const layerParam = this.selectedLayer.getSource().getParams().LAYERS;
      const layerTitle = this.getLayerTitle(this.selectedLayer);
      this.editLayerService.editLayer(
        this.selectedLayer,
        layerParam,
        layerTitle
      );
    }
  }

  getLayerTitle(layer: any) {
    // Get the title of the layer if it exists, otherwise return an empty string
    return layer.get('title') || '';
  }
}
