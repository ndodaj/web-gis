import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from '@core/utils';
import { customStyles } from '@shared/ol/customStyles/customStyles';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { MapService } from '@shared/services/map.service';
import { StyleService } from '@shared/services/style.service';

@Component({
  selector: 'app-messurement',
  templateUrl: './messurement.component.html',
  styleUrls: ['./messurement.component.scss'],
})
@AutoUnsubscribe
export class MessurementComponent implements OnInit {
  tip: any;
  measureForm = this.fb.group({
    measureLength: false,
    measureArea: false,
    measureSegmentLength: true,
    measureClearPrevious: true,
  });
  constructor(
    public mapService: MapService,
    public coordsService: CoordinatesService,
    public styleService: StyleService,
    private fb: UntypedFormBuilder
  ) {}
  ngOnInit(): void {
    this.measureForm.get('measureLength')?.valueChanges.subscribe((value) => {
      if (value) {
        this.getMeasuerLine();
        this.measureForm.get('measureArea')?.reset();
      }
    });
    this.measureForm.get('measureArea')?.valueChanges.subscribe((value) => {
      if (value) {
        this.getMeasurePolygon();
        this.measureForm.get('measureLength')?.reset();
      }
    });
  }

  getMeasuerLine() {
    this.styleService.drawnLineLayer.setMap(this.mapService.getMap());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawLine());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawPoly());
    this.styleService.drawnPolygonSource.clear();
    const drawType = 'LineString';
    const activeTip =
      'Click to continue drawing the ' +
      (drawType === 'LineString' ? 'line' : 'polygon');
    const idleTip = 'Click to start measuring';
    this.tip = idleTip;

    this.styleService.createDrawLine();

    this.styleService.getDrawLine().on('drawstart', () => {
      this.mapService
        .getMap()
        .un('click', this.coordsService.getXYClickListener);
      this.mapService
        .getMap()
        .un('click', this.coordsService.getInfoClickListener);
      if (this.measureForm?.get('measureClearPrevious')?.value) {
        this.styleService.vectorSource.clear();
        this.styleService.drawnLineSource.clear();
      }
      this.measureForm
        ?.get('measureClearPrevious')
        ?.valueChanges.subscribe((value) => {
          if (value) {
            this.styleService.vectorSource.clear();
            this.styleService.drawnLineSource.clear();
          }
        });

      this.styleService.modify.setActive(false);
      this.tip = activeTip;
    });
    this.styleService.getDrawLine().on('drawend', (event) => {
      const drawnLine = event.feature;
      this.styleService.drawnLineSource.addFeature(drawnLine);
      customStyles.modifyStyle.setGeometry(this.styleService.tipPoint);
      this.styleService.modify.setActive(true);
      this.mapService.getMap().once('pointermove', () => {
        customStyles.modifyStyle.setGeometry('');
      });
      this.tip = idleTip;
    });
    this.styleService.modify.setActive(true);
    this.mapService.getMap().addInteraction(this.styleService.getDrawLine());
  }

  getMeasurePolygon() {
    this.styleService.drawnPolygonLayer.setMap(this.mapService.getMap());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawLine());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawPoly());
    this.styleService.drawnLineSource.clear();
    const drawType = 'Polygon';
    const activeTip =
      'Click to continue drawing the ' +
      (drawType === 'Polygon' ? 'polygon' : 'line');
    const idleTip = 'Click to start measuring';
    this.tip = idleTip;

    this.styleService.createDrawPoly();

    this.styleService.getDrawPoly().on('drawstart', () => {
      this.mapService
        .getMap()
        .un('click', this.coordsService.getXYClickListener);
      this.mapService
        .getMap()
        .un('click', this.coordsService.getInfoClickListener);
      if (this.measureForm?.get('measureClearPrevious')?.value) {
        this.styleService.vectorSource.clear();
        this.styleService.drawnPolygonSource.clear();
      }
      this.measureForm
        ?.get('measureClearPrevious')
        ?.valueChanges.subscribe((value) => {
          if (value) {
            this.styleService.vectorSource.clear();
            this.styleService.drawnPolygonSource.clear();
          }
        });
      this.styleService.modify.setActive(false);
      this.tip = activeTip;
    });
    this.styleService.getDrawPoly().on('drawend', (event: any) => {
      const drawnPolygon = event.feature;
      this.styleService.drawnPolygonSource.addFeature(drawnPolygon);
      customStyles.modifyStyle.setGeometry(this.styleService.tipPoint);
      this.styleService.modify.setActive(true);
      this.mapService.getMap().once('pointermove', () => {
        customStyles.modifyStyle.setGeometry('');
      });
      this.tip = idleTip;
    });
    this.styleService.modify.setActive(true);
    this.mapService.getMap().addInteraction(this.styleService.getDrawPoly());
  }

  removeDrawInteraction() {
    this.mapService.getMap().removeInteraction(this.styleService.getDrawPoly());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawLine());
    this.styleService.drawnPolygonSource.clear();
    this.styleService.drawnLineSource.clear();
  }
}
