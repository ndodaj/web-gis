import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { MapService } from '@shared/services/map.service';
import { StyleService } from '@shared/services/style.service';

@Component({
  selector: 'app-coords',
  templateUrl: './coords.component.html',
})
export class CoordsComponent {
  constructor(
    public mapService: MapService,
    public styleService: StyleService,
    public coordService: CoordinatesService,
    private snackBar: MatSnackBar
  ) {}

  getXYCoords() {
    this.snackBar.open('Get Coordinates Is Activated');
    this.mapService.getMap().un('click', this.coordService?.getFeatureInfo);
    this.mapService.getMap().removeInteraction(this.styleService.getDrawPoly());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawLine());
    this.mapService.getMap().removeLayer(this.styleService.drawnLineLayer);
    this.mapService.getMap().removeLayer(this.styleService.drawnPolygonLayer);
    const formContainer = document.querySelector('.form-container')!;

    formContainer?.classList.add('myFormContainer');
    this.mapService
      .getMap()
      .un('click', this.coordService.getInfoClickListener);
    this.mapService.getMap().on('click', this.coordService.getXYClickListener);
  }
}
