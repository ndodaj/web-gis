import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from '@core/api/base-service';
import { AppConfigService } from '@core/services/app-config.service';
import { AuthService } from '@core/services/auth.service';
import ExtendedVectorLayer from '@shared/ol/customLayers/extendedVectorLayer';
import ExtendedVectorSource from '@shared/ol/customLayers/extendedVectorSource';
import { MapService } from '@shared/services/map.service';
import { Feature } from 'ol';
import { fromCircle } from 'ol/geom/Polygon';

import { getPointResolution } from 'ol/proj';
import { AddRadiusComponent } from './components/add-radius.component';
import { take, tap } from 'rxjs';
import {
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Circle,
  LinearRing,
} from 'ol/geom.js';
import OL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import { BufferOp } from 'jsts/org/locationtech/jts/operation/buffer';
import { SelectFeatureService } from '@shared/services/select-feature.service';
import { SaveToLayerService } from '@shared/services/save-to-layer/save-to-layer.service';
@Component({
  selector: 'app-draw-buffer',
  templateUrl: './draw-buffer.component.html',
})
export class DrawBufferComponent extends BaseService {
  formattedCoordinates!: any;
  body!: any;
  url!: any;
  @Input() selectedLayer!: any;
  x: any;
  y: any;
  center: any;
  polygonFromCircle: any;

  constructor(
    public mapService: MapService,
    public selectFeatureService: SelectFeatureService,
    public saveToLayerService: SaveToLayerService,
    public authService: AuthService,
    config: AppConfigService,
    private dialog: MatDialog
  ) {
    super(config);
  }

  activate(event: any) {
    this.selectedLayer = this.mapService.layerSwitcher.getSelection();
    if (event) {
      if (this.mapService.center) {
        this.openDialog(this.mapService.center);
      }
    }
  }

  openDialog(center: any) {
    this.dialog
      .open(AddRadiusComponent, {
        data: center,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((result: any) => {
          if (result) {
            this.drawBuffer(result?.radius);
            //this.drawCircleInMeter(result?.radius, center);
          }
        })
      )
      .subscribe();
  }
  drawCircleInMeter(radius: number, center: any) {
    this.polygonFromCircle = null;

    var view = this.mapService.getMap().getView();
    var projection = view.getProjection();
    var resolutionAtEquator = view.getResolution()!;
    // var center = map.getView().getCenter();
    var pointResolution = getPointResolution(
      projection,
      resolutionAtEquator,
      center
    );
    var resolutionFactor = resolutionAtEquator / pointResolution;
    var radius = (radius / 1) * resolutionFactor;

    var circle = new Circle(center, radius);

    var circleFeature = new Feature(circle);

    // Create a polygon geometry from the circle geometry
    var polygon = fromCircle(circle);

    // Create a feature from the polygon geometry
    this.polygonFromCircle = new Feature(polygon);

    var vectorSource = new ExtendedVectorSource({
      projection: 'EPSG:3857',
      feature: circleFeature,
    });
    vectorSource.addFeature(circleFeature);
    var vectorLayer = new ExtendedVectorLayer({
      source: vectorSource,
    });

    this.mapService.getMap().addLayer(vectorLayer);
    this.saveBufferToLayer(this.polygonFromCircle);
  }

  saveBufferToLayer(feature: any) {
    const coordinates = feature.getGeometry().getCoordinates();

    const formattedData = coordinates.map((set: number[][]) =>
      [...set, set[0]] // Add the first coordinate at the end to close the LinearRing
        .map(coord => coord.join(','))
        .join(' ')
    );
    
    this.formattedCoordinates = formattedData; //.join('\n');
    console.log(this.formattedCoordinates);
    this.body = `<wfs:Transaction service="WFS" version="1.0.0"
      xmlns:wfs="http://www.opengis.net/wfs"
      xmlns:test="http://www.openplans.org/test"
      xmlns:gml="http://www.opengis.net/gml"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd ${this.geoserverUrl}/geoserver/wfs/DescribeFeatureType?typename=test:polygon">
      <wfs:Insert>
        <oecm_areas>
          <test:geom>
            <gml:Polygon srsName="http://www.opengis.net/gml/srs/epsg.xml#3857">
              <gml:outerBoundaryIs>
                <gml:LinearRing>
                  <gml:coordinates decimal="." cs="," ts=" ">
                  ${this.formattedCoordinates}
                  </gml:coordinates>
                </gml:LinearRing>
              </gml:outerBoundaryIs>
            </gml:Polygon>
          </test:geom>
          <test:TYPE>alley</test:TYPE>
          <test:origin>buffer</test:origin>
        </oecm_areas>
      </wfs:Insert>
    </wfs:Transaction>`;

    this.url = `${this.geoserverUrl}/geoserver/test/ows`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
      },
      body: this.body,
    };

    // Make the POST request using the Fetch API
    fetch(this.url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Parse the JSON response
        return response.text();
      })
      .then((data) => {
        const source = this.selectedLayer.getSource();
        source.refresh();
        this.saveToLayerService.saveToLayer(this.selectedLayer, source);

        // Handle the data returned by the server
        console.log('Response from server:', data);
      })
      .catch((error) => {
        // Handle errors that occur during the fetch request
        console.error('There was a problem with your fetch operation:', error);
      });
    //this.saveToLayerService.saveToLayer()
  }

  drawBuffer(meters: any) {
    const feature = this.selectFeatureService.feature;
    console.log(feature);

    if (feature) {
      const parser = new OL3Parser();
      parser.inject(
        Point,
        LineString,
        LinearRing,
        Polygon,
        MultiPoint,
        MultiLineString,
        MultiPolygon
      );

      const jstsGeom = parser.read(feature.getGeometry());

      console.log(jstsGeom);
      const buffered = BufferOp.bufferOp(jstsGeom, meters);

      const bufferedGeometry = parser.write(buffered);
      // Create a new feature with the buffered geometry
      const bufferedFeature = new Feature({
        geometry: bufferedGeometry,
      });

      // Create a vector source and add the feature to it
      const vectorSource = new ExtendedVectorSource({
        features: [bufferedFeature],
      });
      this.saveBufferToLayer(bufferedFeature);

      // Create a vector layer and add the vector source to it
      const vectorLayer = new ExtendedVectorLayer({
        source: vectorSource,
      });

      this.mapService.getMap().addLayer(vectorLayer);
    }
  }
}
