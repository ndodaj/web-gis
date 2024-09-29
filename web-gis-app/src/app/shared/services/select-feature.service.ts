import { Injectable } from '@angular/core';
import { Draw, Modify, Select } from 'ol/interaction';
import { Fill, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { MapService } from './map.service';
import { Point } from 'ol/geom';

@Injectable({
  providedIn: 'root',
})
export class SelectFeatureService {
  selectedFeatures: any;
  deselectedFeatures: any;
  draw!: Draw;
  extent!: any;
  modify!: Modify;
  selectSingleClick!: any;
  private _feature: any; // Private backing variable for feature
  selectedPointStyle = new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: 'red', // Set the fill color of the circle
      }),
      stroke: new Stroke({
        color: 'rgba(254, 246, 0, 1)', // Set the border color of the circle
        width: 2, // Set the border width
      }),
    }),
  });

  selected = new Style({
    fill: new Fill({
      color: 'rgba(254, 246, 0, 1)',
    }),
    stroke: new Stroke({
      color: 'rgba(254, 246, 0, 1)',
      width: 2,
    }),
  });
  modifyStyle = new Style({
    image: new CircleStyle({
      //This is for CircleStyle
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
    }),
    text: new Text({
      text: 'Drag To Modify',
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      padding: [2, 2, 2, 2],
      textAlign: 'left',
      offsetX: 15,
    }),
  });
  selectStyle(feature: any) {
    const geometry = feature.getGeometry();
    const selectedPointStyle = new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: 'red', // Set the fill color of the circle
        }),
        stroke: new Stroke({
          color: 'rgba(254, 246, 0, 1)', // Set the border color of the circle
          width: 2, // Set the border width
        }),
      }),
    });

    // Check if the feature's geometry is a point
    if (geometry instanceof Point) {
      return selectedPointStyle; // Return the selected style for points
    } else {
      const selected = new Style({
        fill: new Fill({
          color: 'rgba(254, 246, 0, 1)',
        }),
        stroke: new Stroke({
          color: 'rgba(254, 246, 0, 1)',
          width: 2,
        }),
      });
      const color = feature.get('COLOR') || '#eeeeee';
      selected?.getFill()?.setColor(color);
      return selected;
    }
  }
  constructor(private mapService: MapService) {}

  selectFeature(layer: any) {
    // const modify = new Modify({
    //   source: layer.getSource(),
    //   style: this.modifyStyle,
    // });
    this.extent = null;
    this.mapService.getMap().removeInteraction(this.draw);
    this.mapService.getMap().removeInteraction(this.modify);
    this.selectSingleClick = new Select({
      layers: [layer],
      style: this.selectStyle,
      hitTolerance: 5,
    });
    this.mapService.getMap().addInteraction(this.selectSingleClick);
    this.selectSingleClick.on('select', (event: any) => {
      this.selectedFeatures = event.selected;
      this.deselectedFeatures = event.deselected;

      this.selectedFeatures.forEach((feature: any) => {
        this.extent = feature.getGeometry().getExtent();
        this._feature = feature;
      });

      this.deselectedFeatures.forEach((feature: any) => {
        console.log('Deselected feature:', feature);
      });
      console.log(this.extent);

      this.mapService.getCenterOfExtent(this.extent);
    });
  }

  get feature(): any {
    return this._feature;
  }
  set feature(value: any) {
    this._feature = value;
  }
}
