import { Injectable, OnInit } from '@angular/core';
import ExtendedVectorLayer from '@shared/ol/customLayers/extendedVectorLayer';
import { customStyles } from '@shared/ol/customStyles/customStyles';
import { Geometry, LineString, Point } from 'ol/geom';
import { Draw, Modify } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import { getArea, getLength } from 'ol/sphere';

@Injectable({
  providedIn: 'root',
})
export class StyleService implements OnInit {
  private drawPoly!: Draw;
  private drawLine!: Draw;

  constructor() {}

  vectorSource = new VectorSource();
  drawnPolygonSource = new VectorSource();
  drawnLineSource = new VectorSource();

  tipPoint: any;
  showSegments!: HTMLInputElement;

  modify = new Modify({
    source: this.vectorSource,
    style: customStyles.modifyStyle,
  });


  ngOnInit(): void {

  }


  createDrawPoly = () => {
    this.showSegments = document.getElementById('segments') as HTMLInputElement;

    this.drawPoly = new Draw({
      source: this.vectorSource,
      type: 'Polygon',
      style: (feature) => {
        return this.styleFunction(
          feature,
          this.showSegments.checked,
          'Polygon',
          'Click to start measuring'
        );
      },
    });
  };

  createDrawLine = () => {
    const showSegments = document.getElementById(
      'segments'
    ) as HTMLInputElement;

    this.drawLine = new Draw({
      source: this.vectorSource,
      type: 'LineString',
      style: (feature) => {
        return this.styleFunction(
          feature,
          showSegments.checked,
          'LineString',
          'Click to start measuring'
        );
      },
    });
  };

  formatArea = function (polygon: Geometry) {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
    } else {
      output = Math.round(area * 100) / 100 + ' m\xB2';
    }
    return output;
  };

  formatLength = function (line: Geometry) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' km';
    } else {
      output = Math.round(length * 100) / 100 + ' m';
    }
    return output;
  };

  styleFunction = (
    feature?: any,
    segments?: any,
    drawType?: any,
    tip?: any
  ) => {
    const segmentStyles = [customStyles.segmentStyle];
    const styles = [customStyles.style];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point, label, line;
    if (!drawType || drawType === type) {
      if (type === 'Polygon') {
        point = geometry.getInteriorPoint();
        label = this.formatArea(geometry);
        line = new LineString(geometry.getCoordinates()[0]);
      } else if (type === 'LineString') {
        point = new Point(geometry.getLastCoordinate());
        label = this.formatLength(geometry);
        line = geometry;
      }
    }
    if (segments && line) {
      let count = 0;
      line.forEachSegment((a: any, b: any) => {
        const segment = new LineString([a, b]);
        const label = this.formatLength(segment);
        if (segmentStyles.length - 1 < count) {
          segmentStyles.push(customStyles.segmentStyle.clone());
        }
        const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        segmentStyles[count].setGeometry(segmentPoint);
        segmentStyles[count]?.getText()?.setText(label);
        styles.push(segmentStyles[count]);
        count++;
      });
    }
    if (label) {
      customStyles.labelStyle.setGeometry(point);
      customStyles.labelStyle.getText()?.setText(label);
      styles.push(customStyles.labelStyle);
    }
    if (
      tip &&
      type === 'Point' &&
      !this.modify.getOverlay().getSource().getFeatures().length
    ) {
      this.tipPoint = geometry;
      customStyles.tipStyle.getText()?.setText(tip);
      styles.push(customStyles.tipStyle);
    }
    return styles;
  };

  getDrawPoly = () => {
    return this.drawPoly;
  };
  getDrawLine = () => {
    return this.drawLine;
  };

  drawnLineLayer = new ExtendedVectorLayer({
    title: 'Measure Line ',
    source: this.drawnLineSource,
    style: this.styleFunction,
  });
  drawnPolygonLayer = new ExtendedVectorLayer({
    title: 'Measure Polygon',
    source: this.drawnPolygonSource,
    style: this.styleFunction,
    displayInLayerSwitcher: false,
  });
}
