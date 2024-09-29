import { Injectable } from '@angular/core';
import { Draw } from 'ol/interaction';
import { MapService } from '../map.service';
import ExtendedTileLayer from '@shared/ol/customLayers/extendedTileLayer';
import { TileWMS } from 'ol/source';
import { environmentCommon } from 'src/environments/environment.common';
import LayerGroup from 'ol/layer/Group';
import { AppConfigService } from '@core/services/app-config.service';
import { BaseService } from '@core/api/base-service';

@Injectable({
  providedIn: 'root',
})
export class SaveToLayerService extends BaseService {
  layerGroup!: any;
  constructor(private mapService: MapService, config: AppConfigService) {
    super(config);
  }

  saveToLayer(layer: any, source: any) {
    const features = source.getFeatures();

    if (!features) {
      return;
    }
    // Get all features from the vector source

    features.forEach((feature: any) => {
      const drawnFeatureIds = feature.getId();
      const idParts = drawnFeatureIds.split('.');
      const numberPart = idParts[1];

      this.updatePropertyID(numberPart, layer);
    });

    this.mapService
      .getMap()
      .getInteractions()
      .forEach((interaction) => {
        if (interaction instanceof Draw) {
          this.mapService.getMap().removeInteraction(interaction);
        }
      });
    const layerGroup = this.getLayerGroup(layer);
    layerGroup.getLayers().remove(layer);
    layerGroup.getLayers().push(this.convertToTileLayer(layer));
    source.refresh();
    //window.location.reload();
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
  updatePropertyID(featureID: any, layer: any) {
    let workspace, layerName, layerParam;
    const source = layer.getSource();

    const layerUrl = source.getUrl();

    // Extract workspace and layer name from the URL
    const urlParts = new URL(layerUrl);
    layerParam = urlParts.searchParams.get('typeName')!; // Get the typeName parameter from the URL
    [workspace, layerName] = layerParam.split(':');

    console.log(workspace, layerName);

    const url = `${this.geoserverUrl}/geoserver/test/ows`;

    var updateBody = `
      <wfs:Transaction service="WFS" version="1.0.0"
      xmlns:topp="http://www.openplans.org/topp"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:wfs="http://www.opengis.net/wfs">
      <wfs:Update typeName="${layerName}">
      <wfs:Property>
      <wfs:Name>gid</wfs:Name>
      <wfs:Value>${featureID}</wfs:Value>
      </wfs:Property>
        <ogc:Filter>
          <ogc:FeatureId fid="${featureID}"/>
        </ogc:Filter>
      </wfs:Update>
      </wfs:Transaction>
    `;

    const updateOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
      },
      body: updateBody,
    };

    fetch(url, updateOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        console.log('Property ID updated successfully:', data);
      })
      .catch((error) => {
        console.error('Error updating property ID:', error);
      });
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
}
