import { Component, Input } from '@angular/core';
import { BaseService } from '@core/api/base-service';
import { AppConfigService } from '@core/services/app-config.service';
import { AuthService } from '@core/services/auth.service';
import { GetInfoService } from '@shared/services/get-info/get-info.service';
import { MapService } from '@shared/services/map.service';
import { Feature } from 'ol';

import { Draw, Modify, Select } from 'ol/interaction';

@Component({
  selector: 'app-modify-wfs',
  templateUrl: './modify-wfs.component.html',
})
export class ModifyWfsComponent extends BaseService {
  isUserLoggedIn!: boolean;
  //layerName!: any;
  // workspace!: any;
  source!: any;
  layerType!: any;
  geometryType!: any;
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
      this.modifyWfs(this.selectedLayer);
    }
  }
  modifyWfs(layer: any) {
    let workspace, layerName: any, layerParam;
    const source = layer.getSource();

    const layerUrl = source.getUrl();

    // Extract workspace and layer name from the URL
    const urlParts = new URL(layerUrl);
    layerParam = urlParts.searchParams.get('typeName')!; // Get the typeName parameter from the URL
    [workspace, layerName] = layerParam.split(':');

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

    // Construct the URL for DescribeFeatureType request
    const describeFeatureTypeUrl = `${this.geoserverUrl}/geoserver/${workspace}/ows?service=WFS&version=1.0.0&request=DescribeFeatureType&typeName=${layerParam}`;

    fetch(describeFeatureTypeUrl)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/xml');

        // Get all 'xsd:element' elements in the XML schema
        const elementNodes = doc.getElementsByTagName('xsd:element');

        // Loop through each 'xsd:element' to find the one with name="geom"
        for (let i = 0; i < elementNodes.length; i++) {
          const element = elementNodes[i];
          const nameAttribute = element.getAttribute('name');

          if (nameAttribute === 'geom') {
            // 'geom' element found, extract its 'type' attribute
            const typeAttribute = element.getAttribute('type')!;
            const [, typeName] = typeAttribute.split(':');

            this.geometryType = typeName;

            if (this.geometryType === 'MultiPolygonPropertyType') {
              this.layerType = 'Polygon';
            } else if (this.geometryType === 'PointPropertyType') {
              this.layerType = 'Point';
            } else if (this.geometryType === 'GeometryPropertyType') {
              this.layerType = 'Polygon';
            } else if (this.geometryType === 'MultiLineStringPropertyType') {
              this.layerType = 'LineString';
            }

            this.mapService.getMap().removeInteraction(this.draw);

            const modify = new Modify({
              source: layer.getSource(),
              features: this.selectSingleClick.getFeatures(),
            });
            this.mapService.getMap().addInteraction(modify);

            // Define a function to handle the geometry modification event
            modify.on('modifyend', (event) => {
              // Get the modified feature
              const modifiedFeature = event.features.item(0) as Feature<any>;
              // Get the modified geometry
              const modifiedGeometry = modifiedFeature
                ?.getGeometry()
                ?.getCoordinates()!;

              if (this.layerType === 'Polygon') {
                this.formattedCoordinates = modifiedGeometry[0][0]
                  .map((coord: any) => `${coord[0]},${coord[1]}`)
                  .join(' ');

                this.body = `<wfs:Transaction service="WFS" version="1.0.0"
                  xmlns:wfs="http://www.opengis.net/wfs"
                  xmlns:ogc="http://www.opengis.net/ogc"
                  xmlns:gml="http://www.opengis.net/gml"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd">
                  <wfs:Update typeName="${layerName}">
                    <wfs:Property>
                      <wfs:Name>geom</wfs:Name>
                      <wfs:Value>
                        <gml:Polygon srsName="EPSG:3857">
                          <gml:outerBoundaryIs>
                            <gml:LinearRing>
                              <gml:coordinates>${
                                this.formattedCoordinates
                              }</gml:coordinates>
                            </gml:LinearRing>
                          </gml:outerBoundaryIs>
                        </gml:Polygon>
                      </wfs:Value>
                    </wfs:Property>
                    <ogc:Filter>
                      <ogc:FeatureId fid="${modifiedFeature.getId()}"/>
                    </ogc:Filter>
                  </wfs:Update>
                </wfs:Transaction>`;
              } else if (this.layerType === 'LineString') {
                this.formattedCoordinates = modifiedGeometry
                  .map((pairArray: any) =>
                    pairArray.map((pair: any) => pair.join(',')).join(' ')
                  )
                  .join(' ');
                this.body = `<wfs:Transaction service="WFS" version="1.0.0"
                    xmlns:topp="http://www.openplans.org/topp"
                    xmlns:ogc="http://www.opengis.net/ogc"
                    xmlns:wfs="http://www.opengis.net/wfs"
                    xmlns:gml="http://www.opengis.net/gml"
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd">
                    <wfs:Update typeName="${layerName}">
                      <wfs:Property>
                        <wfs:Name>geom</wfs:Name>
                        <wfs:Value>
                          <gml:MultiLineString srsName="http://www.opengis.net/gml/srs/epsg.xml#3857">
                            <gml:lineStringMember>
                              <gml:LineString>
                                <gml:coordinates>${
                                  this.formattedCoordinates
                                }</gml:coordinates>
                              </gml:LineString>
                            </gml:lineStringMember>
                          </gml:MultiLineString>
                        </wfs:Value>
                      </wfs:Property>
                      <ogc:Filter>
                        <ogc:FeatureId fid="${modifiedFeature.getId()}"/>
                      </ogc:Filter>
                    </wfs:Update>
                  </wfs:Transaction>`;
              } else if (this.layerType === 'Point') {
                this.formattedCoordinates = modifiedGeometry.join(',');
                this.body = `<wfs:Transaction service="WFS" version="1.0.0"
                  xmlns:wfs="http://www.opengis.net/wfs"
                  xmlns:ogc="http://www.opengis.net/ogc"
                  xmlns:gml="http://www.opengis.net/gml"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd">
                  <wfs:Update typeName="${layerName}">
                    <wfs:Property>
                      <wfs:Name>geom</wfs:Name>
                      <wfs:Value>
                        <gml:Point srsName="EPSG:3857">
                          <gml:coordinates>${
                            this.formattedCoordinates
                          }</gml:coordinates>
                        </gml:Point>
                      </wfs:Value>
                    </wfs:Property>
                    <ogc:Filter>
                      <ogc:FeatureId fid="${modifiedFeature.getId()}"/>
                    </ogc:Filter>
                  </wfs:Update>
                </wfs:Transaction>`;
              }

              const url = `${this.geoserverUrl}/geoserver/test/ows`;
              fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'text/xml',
                },
                body: this.body,
              })
                .then((response) => response.text())
                .then((data) => {
                  console.log('Geometry updated successfully:', data);
                })
                .catch((error) => {
                  console.error('Error updating geometry:', error);
                });
            });
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching DescribeFeatureType:', error);
      });
  }
}
