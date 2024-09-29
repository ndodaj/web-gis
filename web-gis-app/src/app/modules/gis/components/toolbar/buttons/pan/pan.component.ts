import { Component } from '@angular/core';
import { dragPan } from '@shared/ol/dragPan/dragPan';
import { MapService } from '@shared/services/map.service';

@Component({
  selector: 'app-pan',
  templateUrl: './pan.component.html',
})
export class PanComponent {
  constructor(public mapService: MapService) {}

  onDragPan() {
    this.mapService.getMap().addInteraction(dragPan);
  }
}
