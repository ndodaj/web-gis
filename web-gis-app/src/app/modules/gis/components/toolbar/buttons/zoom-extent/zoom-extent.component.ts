import { Component } from '@angular/core';
import { MapService } from '@shared/services/map.service';
import { ScaleService } from '@shared/services/scale/scale.service';

@Component({
  selector: 'app-zoom-extent',
  templateUrl: './zoom-extent.component.html',
})
export class ZoomExtentComponent {
  constructor(
    public mapService: MapService,
    public scaleService: ScaleService
  ) {}

  onZoomExtend() {
    this.mapService
      .getMap()
      .getView()
      .fit([2064411.259926, 4774562.534805, 2399511.191928, 5332247.093174], {
        padding: [10, 10, 10, 10],
        maxZoom: 20,
      });
    this.scaleService.calculateScale();
  }
}
