import { Injectable } from '@angular/core';
import { Draw, Modify } from 'ol/interaction';
import { MapService } from '../map.service';

import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import ExtendedVectorLayer from '@shared/ol/customLayers/extendedVectorLayer';
import LayerGroup from 'ol/layer/Group';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfigService } from '@core/services/app-config.service';
import { BaseService } from '@core/api/base-service';
import ExtendedTileLayer from '@shared/ol/customLayers/extendedTileLayer';
import { TileWMS } from 'ol/source';
import { environmentCommon } from 'src/environments/environment.common';

@Injectable({
  providedIn: 'root',
})
export class EditLayerService extends BaseService {
  draw!: Draw;
  modify!: Modify;
  selectSingleClick!: any;
  featureID!: any;
  source!: any;
  vectorLayer!: any;
  layerParam2!: any;
  workspace!: any;
  layerName!: any;
  wfsVectorLayer: any;
  wfsVectorSource: any;
  layerGroup: any;
  wfsLayerUrl = `${this.geoserverUrl}/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=`;
  wfsLayerUrlEnd = '&maxFeatures=50&outputFormat=application/json';
  // popup = new Overlay({
  //   element: document.getElementById('popup')!,
  //   positioning: 'bottom-center',
  // });

  constructor(
    private mapService: MapService,
    private snackBarService: MatSnackBar,
    config: AppConfigService
  ) {
    super(config);
    //this.mapService.getMap().addOverlay(this.popup);
  }

  editLayer(
    selectedLayer: any,

    layerParam: any,

    layerTitle: any
  ) {
    if (!selectedLayer) {
      alert('Please select a layer!');
      return;
    }
    console.log('edit layer', this.wfsVectorLayer);
    // if (this.wfsVectorLayer) {
    //   const layerGroup = this.getLayerGroup(this.wfsVectorLayer);
    //   layerGroup.getLayers().remove(this.wfsVectorLayer);
    //   layerGroup.getLayers().push(this.convertToTileLayer(this.wfsVectorLayer));
    //   // source.refresh();

    //   // const layerGroup = this.getLayerGroup(selectedLayer);
    //   // layerGroup.getLayers().remove(this.wfsVectorLayer);
    // }

    //WFS Layer
    this.wfsVectorSource = new VectorSource({
      url: this.wfsLayerUrl + layerParam + this.wfsLayerUrlEnd,
      format: new GeoJSON(),
      attributions: '@geoserver',
    });

    this.wfsVectorLayer = new ExtendedVectorLayer({
      source: this.wfsVectorSource,
      title: layerTitle,
      // crossOrigin: "anonymous",
      // opacity: 0,
      visible: true,
      displayInLayerSwitcher: true,
    });

    // Remove the polygon tile layer from the map
    const layerGroup = this.getLayerGroup(selectedLayer);
    layerGroup.getLayers().remove(selectedLayer);
    layerGroup.getLayers().push(this.wfsVectorLayer);
    this.mapService.layerSwitcher.selectLayer(this.wfsVectorLayer);
    this.snackBarService.open(`You Are Editing ${layerTitle} Indicator`, '', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  getLayerGroup(layer: any) {
    this.mapService
      .getMap()
      .getLayers()
      .forEach((groupLayer) => {
        if (groupLayer instanceof LayerGroup) {
          if (groupLayer.getLayers().getArray().includes(layer)) {
            this.layerGroup = groupLayer;
          }
        }
      });
    return this.layerGroup;
  }
  convertToTileLayer(layer: any) {
    const source = layer.getSource();
    const url = source.getUrl();
    const urlParts = new URL(url);
    const layerParam = urlParts?.searchParams?.get('typeName')!; // Get the typeName parameter from the URL

    const tileLayer = new ExtendedTileLayer({
      source: new TileWMS({
        url: environmentCommon.url,
        params: {
          CQL_FILTER: 'accepted = true',
          LAYERS: layerParam,
          VERSION: '1.1.0',
        },
        crossOrigin: 'anonymous',
      }),
      visible: true,
      title: layer.get('title'),
      information: 'Description here...',
      displayInLayerSwitcher: true,
    });
    return tileLayer;
  }
  // getPop() {
  //   this.popup;
  // }
}
