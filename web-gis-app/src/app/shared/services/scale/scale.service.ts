import { Injectable } from '@angular/core';
import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class ScaleService {
  constructor(public mapService: MapService) {}

  calculateScale() {
    // Get the map's view
    const view = this.mapService.getMap().getView();

    const resolution = view.getResolution()!;
    //const center = view.getCenter();
    const projection = view.getProjection();
    const meterPerMapUnit = projection.getMetersPerUnit()!;
    //const mapWidth = this.mapService.getMap().getTargetElement().clientWidth;
    //const mapWidthMeters = resolution * mapWidth * meterPerMapUnit;

    const dpi = 96;
    const inchesPerMeter = 39.3701;
    const scale = resolution * meterPerMapUnit * inchesPerMeter * dpi;

    const scaleInput = document.getElementById('scaleInput')! as any;
    scaleInput.value = '1:' + scale.toFixed(0);
  }
}
