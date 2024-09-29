import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { GetInfoService } from '@shared/services/get-info/get-info.service';
import { MapService } from '@shared/services/map.service';

import { Draw, Modify, Select } from 'ol/interaction';

@Component({
  selector: 'app-edit-attributes',
  templateUrl: './edit-attributes.component.html',
})
export class EditAttributesComponent implements OnInit {
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
    private getInfoService: GetInfoService,
    public coordService: CoordinatesService
  ) {
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.getInfoService.saveFormBtn();
  }

  activate(event: any) {
    //this.mapService.getMap().removeInteraction(this.draw);

    this.mapService
      .getMap()
      .getInteractions()
      .forEach((interaction) => {
        if (interaction instanceof Draw) {
          this.mapService.getMap().removeInteraction(interaction);
        } else if (interaction instanceof Select) {
          this.mapService.getMap().removeInteraction(interaction);
        } else if (interaction instanceof Modify) {
          this.mapService.getMap().removeInteraction(interaction);
        }
      });
    this.mapService.getMap().un('singleclick', this.getInfoService.singleClick);
    this.mapService
      .getMap()
      .un('click', this.coordService.getInfoClickListener);
    this.selectedLayer = this.mapService.layerSwitcher.getSelection();

    if (event && !this.selectedLayer) {
      alert('Please select a indicator first.');
      return;
    } else if (event && this.selectedLayer) {
      this.getInfoService.getFeatureInfo();
    }
  }

  getLayerTitle(layer: any) {
    // Get the title of the layer if it exists, otherwise return an empty string
    return layer.get('title') || '';
  }
}
