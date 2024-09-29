import { Component } from '@angular/core';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { MapService } from '@shared/services/map.service';
import { ScaleService } from '@shared/services/scale/scale.service';
import { Feature, Geolocation } from 'ol';
import { Geometry, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'app-get-location',
  templateUrl: './get-location.component.html',
})
export class GetLocationComponent {
  currentPositionLayer: any;
  isTracking: boolean = false;

  constructor(
    public mapService: MapService,
    public scaleService: ScaleService,
    public coordsService: CoordinatesService
  ) {}

  geoLocation() {
    if (this.isTracking) {
      this.stopGeolocationTracking();
    } else {
      this.startGeolocationTracking();
    }
  }

  startGeolocationTracking() {
    const geolocation = new Geolocation();
    const viewProjection = this.mapService.getMap()?.getView().getProjection();
    if (viewProjection) {
      geolocation.setTrackingOptions({
        enableHighAccuracy: true,
      });
      geolocation.setProjection(viewProjection);
    }
    const accuracyFeature = new Feature();
    geolocation.on('change:accuracyGeometry', () => {
      accuracyFeature.setGeometry(
        geolocation.getAccuracyGeometry() as Geometry
      );
    });
    const currentPositionFeature = new Feature();
    geolocation.on('change:position', () => {
      let currentPosition = geolocation.getPosition();
      if (currentPosition) {
        this.mapService.getMap().getView().setCenter(currentPosition);
        this.mapService.getMap().getView().setZoom(18);
        currentPositionFeature.setGeometry(new Point(currentPosition));
      }
      this.scaleService.calculateScale();
    });
    geolocation.setTracking(true);
    this.currentPositionLayer = new VectorLayer({
      source: new VectorSource({
        features: [currentPositionFeature, accuracyFeature],
      }),
    });
    this.mapService.getMap().addLayer(this.currentPositionLayer);
    this.isTracking = true;
  }

  stopGeolocationTracking() {
    //const geolocationButton = document.getElementById('getGeolocation');
    const geolocation = new Geolocation();
    //const originalButtonHTML = geolocationButton?.innerHTML;
    geolocation.setTracking(false);
    this.mapService.getMap().removeLayer(this.currentPositionLayer);
    this.isTracking = false; // Update the tracking state
    // if (originalButtonHTML) {
    //   geolocationButton.innerHTML = originalButtonHTML;
    // }
    this.coordsService.clearDrawInteraction();
    this.onZoomExtend();
  }

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
