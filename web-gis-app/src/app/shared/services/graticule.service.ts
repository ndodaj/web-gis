import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import ExtendedOlExtGraticule from '@shared/ol/customLayers/extendedOlExtGraticule';
import { projections } from '@shared/ol/projection/projection';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { StyleService } from '@shared/services/style.service';
//import ol_control_Graticule from 'ol-ext/control/Graticule';
import { Fill, Stroke, Style, Text } from 'ol/style';
const graticuleStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(128, 128, 128, 0.7)', // Grey color with 70% transparency
    width: 1.25, // Line width
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000', // Black text color
    }),
    stroke: new Stroke({
      color: '#fff', // White border around text
      width: 3,
    }),
    textAlign: 'center', // Align text in the center
    offsetY: -10, // Adjusts text placement above the line
  }),
});
@Injectable({
  providedIn: 'root',
})
export class GraticuleService {
  graticule = new ExtendedOlExtGraticule({
    step: 10,
    stepCoord: 2,
    spacing: 120,
    projection: projections.proj32634,
    style: graticuleStyle,
    showLabel: true,
  });
  constructor(
    public mapService: MapService,
    public styleService: StyleService,
    public coordsService: CoordinatesService
  ) {}

  showGraticule() {
    this.mapService.getMap().removeInteraction(this.styleService.getDrawPoly());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawLine());
    this.styleService.drawnPolygonSource.clear();
    this.styleService.drawnLineSource.clear();
    this.mapService.getMap().addControl(this.graticule);
  }
  removeGraticule() {
    this.mapService.getMap().removeControl(this.graticule);
  }
}
