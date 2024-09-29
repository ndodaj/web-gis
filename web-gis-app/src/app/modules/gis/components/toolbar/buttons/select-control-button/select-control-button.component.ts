import { Component, OnInit } from '@angular/core';
import { LayerControlService } from '@shared/services/layer-control/layer-control.service';
import { MapService } from '@shared/services/map.service';

@Component({
  selector: 'app-select-control-button',
  templateUrl: './select-control-button.component.html',
  styleUrls: ['./select-control-button.component.scss'],
})
export class SelectControlButtonComponent implements OnInit {
  constructor(
    public layerControlService: LayerControlService,
    public mapService: MapService
  ) {}

  ngOnInit(): void {
    this.selectControlBtnClick();
  }

  selectControlBtnClick() {
    const selectControlBtn = document.querySelector(
      '#selectControlButton'
    ) as HTMLElement;
    const selectControlForm = document.querySelector(
      '.selectControl'
    ) as HTMLInputElement;
    selectControlBtn.addEventListener('click', () => {
      selectControlForm.hidden = !selectControlForm.hidden;

      this.layerControlService.addLayerToQuery(
        this.mapService
          .getMap()
          .getAllLayers()
          // Filter only visible layers
          .filter((layer) => layer.getVisible())
          // Filter layers with specific titles
          .filter((layer) => {
            const title = layer.get('title');

            return (
              title !== 'CartoDarkAll' &&
              title !== 'State Border' &&
              title !== 'Protected Areas' &&
              title !== 'BingMap' &&
              title !== 'OSM' &&
              title !== 'Ortofoto 2015 20cm'
            );
          })
      );
      this.layerControlService.getFields();
    });
  }
}
