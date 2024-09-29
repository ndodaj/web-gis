import { Component, OnInit } from '@angular/core';
import { MapService } from '@shared/services/map.service';

@Component({
  selector: 'app-arrow-back',
  templateUrl: './arrow-back.component.html',
  styleUrls: ['./arrow-back.component.scss'],
})
export class ArrowBackComponent implements OnInit {
  constructor(public mapService: MapService) {}

  ngOnInit(): void {
    this.moveLeft();
  }

  moveButton(value1: any, value2: any, value3: any) {
    const currentCenter = this.mapService.getMap().getView().getCenter();
    if (currentCenter) {
      if (this.mapService.getMap().getView().getZoom()! < 5) {
        const newCenter = [currentCenter[0] + value1, currentCenter[1]];
        this.mapService.getMap().getView().setCenter(newCenter);
      } else if (
        this.mapService.getMap().getView().getZoom()! >= 5 &&
        this.mapService.getMap().getView().getZoom()! < 10
      ) {
        const newCenter = [currentCenter[0] + value2, currentCenter[1]];
        this.mapService.getMap().getView().setCenter(newCenter);
      } else if (this.mapService.getMap().getView().getZoom()! >= 10) {
        const newCenter = [currentCenter[0] + value3, currentCenter[1]];
        this.mapService.getMap().getView().setCenter(newCenter);
      }
    }
  }

  moveLeft() {
    const leftBtn = document.getElementById('move-left');


    leftBtn?.addEventListener('click', () => {
      this.moveButton(-100000, -10000, -100);
    });
  }
}
