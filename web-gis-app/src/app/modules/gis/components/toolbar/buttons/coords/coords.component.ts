import { Component } from '@angular/core';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { MapService } from '@shared/services/map.service';
import { StyleService } from '@shared/services/style.service';
@Component({
  selector: 'app-coords',
  templateUrl: './coords.component.html',
})
export class CoordsComponent {
  isActive: boolean = false;
  constructor(
    public mapService: MapService,
    public styleService: StyleService,
    public coordService: CoordinatesService
  ) {}
  toggleCoords() {
    this.isActive = !this.isActive;

    if (this.isActive) {
      this.getXYCoords();
    } else {
      this.mapService
        .getMap()
        .un('click', this.coordService?.getXYClickListener);
    }
  }
  getXYCoords() {
    this.mapService.getMap().un('click', this.coordService?.getFeatureInfo);
    this.mapService.getMap().removeInteraction(this.styleService.getDrawPoly());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawLine());
    this.mapService.getMap().removeLayer(this.styleService.drawnLineLayer);
    this.mapService.getMap().removeLayer(this.styleService.drawnPolygonLayer);
    this.mapService
      .getMap()
      .un('click', this.coordService.getInfoClickListener);
    this.mapService.getMap().on('click', this.coordService.getXYClickListener);
  }
}
