import { Component, OnInit } from '@angular/core';
import { customStyles } from '@shared/ol/customStyles/customStyles';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { MapService } from '@shared/services/map.service';
import { StyleService } from '@shared/services/style.service';
import { Graticule } from 'ol';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
})
export class GridViewComponent implements OnInit {
  constructor(
    public mapService: MapService,
    public styleService: StyleService,
    public coordsService: CoordinatesService
  ) {}

  ngOnInit(): void {
    this.showGraticule();
  }

  showGraticule() {
    this.mapService.getMap().removeInteraction(this.styleService.getDrawPoly());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawLine());
    this.styleService.drawnPolygonSource.clear();
    this.styleService.drawnLineSource.clear();
    const toggleButton = document.getElementById('graticuleButton');
    let graticule: any;
    toggleButton?.addEventListener('click', () => {
      this.coordsService.clearDrawInteraction();
      if (graticule) {
        this.mapService.getMap().removeControl(graticule);
        graticule = undefined;
      } else {
        graticule = new Graticule({
          strokeStyle: customStyles.strokeStyle,
          showLabels: true,
        });
        this.mapService.getMap().addControl(graticule);
      }
    });
  }
}
