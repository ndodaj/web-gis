import { Component, OnInit } from '@angular/core';
import { MapService } from '@shared/services/map.service';

@Component({
  selector: 'app-zoom-in',
  templateUrl: './zoom-in.component.html',
  styleUrls: ['./zoom-in.component.scss'],
})
export class ZoomInComponent implements OnInit {
  constructor(public mapService: MapService) {}

  ngOnInit(): void {
    this.zoomIn();
  }

  calculateScale() {
    const view = this.mapService.getMap().getView();
    const resolution = view.getResolution();
    const units = view.getProjection().getUnits();
    const inchesPerUnit: any = {
      m: 39.37007874,
      ft: 12,
    };

    const dpi = 96;
    if (resolution) {
      const scale = resolution * inchesPerUnit[units] * dpi;
      const scaleInput = document.getElementById(
        'scaleInput'
      ) as HTMLInputElement;
      scaleInput!.value = '1:' + scale.toFixed(0);
    }
  }

  zoomFunc(value: any) {
    const view = this.mapService.getMap().getView();
    const currentZoom = view.getZoom();
    const newZoom = currentZoom + value;
    view.setZoom(newZoom);
    this.calculateScale();
  }

  zoomIn() {
    const zoomInBtn = document.getElementById('zoom-in');

    zoomInBtn?.addEventListener('click', () => {
      this.zoomFunc(1);
    });
  }
}
