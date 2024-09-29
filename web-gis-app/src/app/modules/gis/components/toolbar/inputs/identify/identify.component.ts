import { Component, OnInit } from '@angular/core';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { MapService } from '@shared/services/map.service';
import { StyleService } from '@shared/services/style.service';

@Component({
  selector: 'app-identify',
  templateUrl: './identify.component.html',
})
export class IdentifyComponent implements OnInit {
  constructor(
    public mapService: MapService,
    public styleService: StyleService,
    public coordsService: CoordinatesService
  ) {}

  ngOnInit(): void {
    this.getInfoBtn();
  }

  getInfoBtn() {
    const InfoBtn = document.getElementById('identify');
    InfoBtn?.addEventListener('click', () => {
      this.coordsService.clearDrawInteraction();
      this.mapService
        .getMap()
        .un('click', this.coordsService.getXYClickListener);
      this.coordsService.getFeatureInfo;
      this.mapService
        .getMap()
        .removeInteraction(this.styleService.getDrawPoly());
      this.mapService
        .getMap()
        .removeInteraction(this.styleService.getDrawLine());
      this.mapService.getMap().removeLayer(this.styleService.drawnLineLayer);
      this.mapService.getMap().removeLayer(this.styleService.drawnPolygonLayer);
    });
  }
}
