import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseService } from '@core/api/base-service';
import { AppConfigService } from '@core/services/app-config.service';
import { AuthService } from '@core/services/auth.service';
import { GetInfoService } from '@shared/services/get-info/get-info.service';
import { MapService } from '@shared/services/map.service';

import { Draw, Select } from 'ol/interaction';

@Component({
  selector: 'app-delete-wfs',
  templateUrl: './delete-wfs.component.html',
})
export class DeleteWfsComponent extends BaseService {
  isUserLoggedIn!: boolean;
  workspace!: any;
  source!: any;
  layerType!: any;
  formattedCoordinates!: any;
  body!: any;
  url!: any;
  draw!: Draw;
  selectSingleClick!: any;
  @Input() selectedLayer!: any;

  map = this.mapService.getMap();
  constructor(
    public mapService: MapService,
    public authService: AuthService,
    private getInfoService: GetInfoService,
    private snackBarService: MatSnackBar,
    config: AppConfigService
  ) {
    super(config);
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  activate(event: any) {
    this.selectedLayer = this.mapService.layerSwitcher.getSelection();

    if (event && !this.selectedLayer) {
      alert('Please select a indicator first.');
      return;
    } else if (event && this.selectedLayer) {
      this.mapService
        .getMap()
        .un('singleclick', this.getInfoService.singleClick);
      this.deleteWFS(this.selectedLayer);
    }
  }

  deleteWFS(layer: any) {
    let workspace, layerName: any, layerParam;
    const source = layer.getSource();

    const layerUrl = source.getUrl();

    // Extract workspace and layer name from the URL
    const urlParts = new URL(layerUrl);
    layerParam = urlParts.searchParams.get('typeName')!; // Get the typeName parameter from the URL
    [workspace, layerName] = layerParam.split(':');

    console.log(workspace, layerName);

    this.mapService
      .getMap()
      .getInteractions()
      .forEach((interaction) => {
        if (interaction instanceof Select) {
          this.selectSingleClick = interaction;
        }
      });
    if (!this.selectSingleClick) {
      alert('Please select a feature first.');
      return;
    }
    const selectedFeatures = this.selectSingleClick.getFeatures();
    const selectedFeaturesArray = selectedFeatures.getArray();
    selectedFeaturesArray.forEach((feature: any) => {
      // Do something with the feature
      layer.getSource().removeFeature(feature);
      console.log(feature);

      const selectedFeatureValueID = feature.get('gid');
      console.log(selectedFeatureValueID);

      // You can perform any other operations with the feature here
      this.url = `${this.geoserverUrl}/geoserver/test/ows`;
      const body = `<wfs:Transaction service="WFS" version="1.0.0"
                  xmlns:cdf="http://www.opengis.net/cite/data"
                  xmlns:ogc="http://www.opengis.net/ogc"
                  xmlns:wfs="http://www.opengis.net/wfs"
                  xmlns:topp="http://www.openplans.org/topp">
                  <wfs:Delete typeName="${layerName}">
                    <ogc:Filter>
                      <ogc:PropertyIsEqualTo>
                        <ogc:PropertyName>gid</ogc:PropertyName>
                        <ogc:Literal>${selectedFeatureValueID}</ogc:Literal>
                      </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                  </wfs:Delete>
                </wfs:Transaction>`;

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
        },
        body: body,
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
          // Handle the data returned by the server
          console.log('Response from server:', data);
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
          this.snackBarService.open('Feature Removed Successfully!');
        })
        .catch((error) => {
          // Handle errors that occur during the fetch request
          console.error(
            'There was a problem with your fetch operation:',
            error
          );
        });
    });
  }
}
