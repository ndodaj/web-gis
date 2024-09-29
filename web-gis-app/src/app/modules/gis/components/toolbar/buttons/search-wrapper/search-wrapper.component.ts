import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { customStyles } from '@shared/ol/customStyles/customStyles';
import { MapService } from '@shared/services/map.service';
import { ScaleService } from '@shared/services/scale/scale.service';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'app-search-wrapper',
  templateUrl: './search-wrapper.component.html',
  styleUrls: ['./search-wrapper.component.scss'],
})
export class SearchWrapperComponent implements OnInit {
  @ViewChild('secondDialog', { static: true }) secondDialog!: TemplateRef<any>;
  constructor(
    public mapService: MapService,
    public scaleService: ScaleService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.onGeoSearch();

    const print = document.querySelector('.ol-search') as any;
    print.style.background = 'transparent';
  }
  openDialogWithoutRef() {
    this.dialog.open(this.secondDialog);
  }
  onGeoSearch() {
    this.mapService.geoSearch.on('select', (event: any) => {
      const selectedResultCoordinates = event.coordinate;
      const pointFeature = new Feature({
        geometry: new Point(selectedResultCoordinates),
      });
      const vectorSource = new VectorSource({
        features: [pointFeature],
      });
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: customStyles.geoStyle,
      });
      this.mapService.getMap().addLayer(vectorLayer);
      setTimeout(() => {
        vectorSource.removeFeature(pointFeature);
      }, 2000);
      this.mapService.getMap().getView().setCenter(selectedResultCoordinates);
      this.mapService.getMap().getView().setZoom(12);
      this.scaleService.calculateScale();
      this.mapService.geoSearch.clearHistory();
    });
    const searchBox = document.querySelector('.ol-search') as HTMLElement;
    const searchWrapper = document.querySelector(
      '.search-wrapper'
    ) as HTMLElement;
    searchWrapper.appendChild(searchBox);
  }
}
