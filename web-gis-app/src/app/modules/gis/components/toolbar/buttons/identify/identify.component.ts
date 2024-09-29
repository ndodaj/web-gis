import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { GetInfoService } from '@shared/services/get-info/get-info.service';
import { MapService } from '@shared/services/map.service';
import { StyleService } from '@shared/services/style.service';
import { Draw, Select } from 'ol/interaction';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-identify',
  templateUrl: './identify.component.html',
})
export class IdentifyComponent {
  @ViewChild('op') overlayPanel!: OverlayPanel;
  properties!: { key: string; value: any }[];

  constructor(
    public mapService: MapService,
    public styleService: StyleService,
    public coordsService: CoordinatesService,
    private getInfoService: GetInfoService,
    private snackBar: MatSnackBar
  ) {}

  getInfo() {
    this.snackBar.open('Get Information Is Activated');
    this.mapService
      .getMap()
      .getInteractions()
      .forEach((interaction) => {
        if (interaction instanceof Draw) {
          this.mapService.getMap().removeInteraction(interaction);
        } else if (interaction instanceof Select) {
          this.mapService.getMap().removeInteraction(interaction);
        }
      });
    this.coordsService.clearDrawInteraction();
    this.mapService.getMap().un('singleclick', this.getInfoService.singleClick);
    this.mapService.getMap().un('click', this.coordsService.getXYClickListener);
    this.mapService.getMap().on('click', this.coordsService?.getFeatureInfo);
    this.mapService.getMap().removeInteraction(this.styleService.getDrawPoly());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawLine());
    this.mapService.getMap().removeLayer(this.styleService.drawnLineLayer);
    this.mapService.getMap().removeLayer(this.styleService.drawnPolygonLayer);
  }
}
