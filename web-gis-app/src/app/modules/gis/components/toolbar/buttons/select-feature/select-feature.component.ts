import { Component, Input } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { GetInfoService } from '@shared/services/get-info/get-info.service';
import { MapService } from '@shared/services/map.service';
import { SelectFeatureService } from '@shared/services/select-feature.service';
import { Draw, Modify } from 'ol/interaction';

@Component({
  selector: 'app-select-feature',
  templateUrl: './select-feature.component.html',
})
export class SelectFeatureComponent {
  isUserLoggedIn!: boolean;
  layerName!: any;
  workspace!: any;
  source!: any;
  layerType!: any;
  formattedCoordinates!: any;
  body!: any;
  url!: any;
  draw!: Draw;
  selectSingleClick!: any;
  @Input() selectedLayer!: any;

  map = this.mapService.getMap();
  constructor(
    public mapService: MapService,
    public authService: AuthService,
    private selectFeatureService: SelectFeatureService,
    private getInfoService: GetInfoService,
    public coordsService: CoordinatesService
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
      this.mapService
        .getMap()
        .un('singleclick', this.getInfoService.singleClick);
      this.mapService
        .getMap()
        .un('click', this.coordsService.getXYClickListener);
      this.selectFeatureService.selectFeature(this.selectedLayer);
    }
  }
}
