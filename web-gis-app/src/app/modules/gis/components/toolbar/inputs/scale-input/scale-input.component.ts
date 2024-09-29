import { Component, OnInit } from '@angular/core';
import { MapService } from '@shared/services/map.service';

@Component({
  selector: 'app-scale-input',
  templateUrl: './scale-input.component.html',
  styleUrls: ['./scale-input.component.scss'],
})
export class ScaleInputComponent implements OnInit {
  constructor(public mapService: MapService) {}

  ngOnInit(): void {
    this.setMapScale2();
  }

  setMapScale() {
    const inputElement = document.getElementById(
      'scaleInput'
    ) as HTMLInputElement;
    const scaleValue = inputElement.value.trim();

    const scaleRegex = /^1:(\d+)$/;
    const scaleMatch = scaleValue.match(scaleRegex);

    if (scaleMatch) {
      const scaleNumber = parseInt(scaleMatch[1]);
      const projection = this.mapService.getMap().getView().getProjection();
      const meterPerMapUnit = projection.getMetersPerUnit()!;
      const view = this.mapService.getMap().getView();
      const inchesPerMeter = 39.3701;
      const dpi = 96;
      const resolution = scaleNumber / (inchesPerMeter * dpi * meterPerMapUnit);
      view.setResolution(resolution);
    } else {
      console.error("Invalid scale format. Please use the format '1:xxxxx'.");
    }
  }

  setMapScale2() {
    const inputElement = document.getElementById('scaleInput');
    inputElement?.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.setMapScale();
      }
    });
  }
}
