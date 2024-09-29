import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseService } from '@core/api/base-service';
import { AppConfigService } from '@core/services/app-config.service';
import { AuthService } from '@core/services/auth.service';
import { GetInfoService } from '@shared/services/get-info/get-info.service';
import { MapService } from '@shared/services/map.service';
import { Feature } from 'ol';
import { Draw, Modify } from 'ol/interaction';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
})
export class AddDataComponent extends BaseService {
  isUserLoggedIn!: boolean;
  layerName!: any;
  workspace!: any;
  geometryType!: any;
  source!: any;
  layerType!: any;
  formattedCoordinates!: any;
  body!: any;
  url!: any;
  layerTitle!: any;
  selectedLayerGroup!: any;
  layerGroup!: any;
  layerParam!: any;
  draw!: Draw;
  @Input() selectedLayer!: any;
  @Input() buttonType = 'button';

  map = this.mapService.getMap();
  constructor(
    public mapService: MapService,
    public authService: AuthService,
    private snackBarService: MatSnackBar,
    private getInfoService: GetInfoService,
    config: AppConfigService
  ) {
    super(config);
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  activate(event: any) {
    this.mapService.getMap().removeInteraction(this.draw);

    this.selectedLayer = this.mapService.layerSwitcher.getSelection();

    if (event && !this.selectedLayer) {
      alert('Please select a indicator first.');
      return;
    } else if (event && this.selectedLayer) {
      this.mapService
        .getMap()
        .un('singleclick', this.getInfoService.singleClick);
      this.drawFeatureWfs(this.selectedLayer);
    }
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
  drawFeatureWfs(selectedLayer: any) {
    const layer = selectedLayer;

    if (layer instanceof LayerGroup) {
    } else if (layer instanceof TileLayer) {
      this.layerTitle = selectedLayer.get('title');

      this.layerParam = selectedLayer.getSource().getParams().LAYERS;
      this.getLayerGroup(layer);

      // Get the layer group containing the selected layer
      this.selectedLayerGroup = this.getLayerGroup(selectedLayer);
    } else {
      this.source = selectedLayer.getSource();
      const url = this.source.getUrl();
      const urlParts = new URL(url);
      const layerParam = urlParts?.searchParams?.get('typeName')!; // Get the typeName parameter from the URL
      console.log(layerParam);

      [this.workspace, this.layerName] = layerParam.split(':');

      console.log(this.workspace, this.layerName);

      // Construct the URL for DescribeFeatureType request
      const describeFeatureTypeUrl = `${this.geoserverUrl}/geoserver/${this.workspace}/ows?service=WFS&version=1.0.0&request=DescribeFeatureType&typeName=${layerParam}`;

      // Make an AJAX request to GeoServer
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
              //console.log(this.geometryType);

              if (
                this.geometryType === 'MultiPolygonPropertyType' ||
                this.geometryType === 'GeometryPropertyType' ||
                this.geometryType === 'PolygonPropertyType'
              ) {
                this.layerType = 'Polygon';
              } else if (
                this.geometryType === 'PointPropertyType' ||
                this.geometryType === 'MultiPointPropertyType'
              ) {
                this.layerType = 'Point';
              } else if (this.geometryType === 'MultiLineStringPropertyType') {
                this.layerType = 'LineString';
              }

              console.log(this.layerType);

              this.draw = new Draw({
                source: this.source,
                type: this.layerType,
              });

              this.mapService.getMap().addInteraction(this.draw);

              this.draw.on('drawend', (event) => {
                const feature = event.feature! as Feature<any>;
                // const featureID = feature.getId();
                // Set the ID attribute to the feature

                const coordinates = feature?.getGeometry()?.getCoordinates();

                //this.layerType = 'Point';

                if (this.layerType === 'LineString') {
                  // Map over the array and join each pair of coordinates with a space
                  this.formattedCoordinates = coordinates
                    .map((pair: any) => pair.join(','))
                    .join(' ');

                  this.body = `<wfs:Transaction service="WFS" version="1.0.0"
                xmlns:wfs="http://www.opengis.net/wfs"
                xmlns:test="http://www.openplans.org/test"
                xmlns:gml="http://www.opengis.net/gml"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org ${this.geoserverUrl}/geoserver/wfs/DescribeFeatureType?typename=test:line">
                <wfs:Insert>
                  <${this.layerName}>
                    <${this.workspace}:geom>
                      <gml:MultiLineString srsName="http://www.opengis.net/gml/srs/epsg.xml#3857">
                        <gml:lineStringMember>
                          <gml:LineString>
                            <gml:coordinates decimal="." cs="," ts=" ">
                            ${this.formattedCoordinates}
                            </gml:coordinates>
                          </gml:LineString>
                        </gml:lineStringMember>
                      </gml:MultiLineString>
                    </${this.workspace}:geom>
                    <${this.workspace}:TYPE>alley</${this.workspace}:TYPE>
                  </${this.layerName}>
                </wfs:Insert>
                </wfs:Transaction>`;
                  // this.saveToLayerService.saveToLayer(
                  //   selectedLayer,
                  //   this.source
                  // );
                } else if (this.layerType === 'Polygon') {
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
                    <${this.layerName}>
                      <${this.workspace}:geom>
                        <gml:Polygon srsName="urn:x-ogc:def:crs:EPSG:3857">
                          <gml:outerBoundaryIs>
                            <gml:LinearRing>
                              <gml:coordinates>${this.formattedCoordinates}</gml:coordinates>
                            </gml:LinearRing>
                          </gml:outerBoundaryIs>
                        </gml:Polygon>
                      </${this.workspace}:geom>
                      <${this.workspace}:TYPE>alley</${this.workspace}:TYPE>
                    </${this.layerName}>
                  </wfs:Insert>
                </wfs:Transaction>
                `;             
                console.log(this.body);   
                } else if (this.layerType === 'Point') {
                  this.formattedCoordinates = [
                    coordinates[0],
                    coordinates[1],
                  ].join(',');

                  this.body = `<wfs:Transaction service="WFS" version="1.0.0"
                  xmlns:wfs="http://www.opengis.net/wfs"
                  xmlns:test="http://www.openplans.org/test"
                  xmlns:gml="http://www.opengis.net/gml"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org ${this.geoserverUrl}/geoserver/wfs/DescribeFeatureType?typename=test:points">
                  <wfs:Insert>
                    <${this.layerName}>
                      <${this.workspace}:geom>
                      <gml:Point srsDimension="2" srsName="urn:x-ogc:def:crs:EPSG:3857">
                      <gml:coordinates xmlns:gml="http://www.opengis.net/gml"
                      decimal="." cs="," ts=" ">${this.formattedCoordinates}</gml:coordinates>
                      </gml:Point>
                      </${this.workspace}:geom>
                      <${this.workspace}:TYPE>alley</${this.workspace}:TYPE>
                    </${this.layerName}>
                  </wfs:Insert>
                  </wfs:Transaction>`;
                }

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
                    this.source.refresh();

                    this.mapService
                      .getMap()
                      .getInteractions()
                      .forEach((interaction) => {
                        if (interaction instanceof Draw) {
                          this.mapService
                            .getMap()
                            .removeInteraction(interaction);
                        } else if (interaction instanceof Modify) {
                          this.mapService
                            .getMap()
                            .removeInteraction(interaction);
                        }
                      });
                    // Handle the data returned by the server
                    console.log('Response from server:', data);
                    this.snackBarService.open(
                      'Click Save to Indicator to Save Feature!'
                    );
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
        })
        .catch((error) => {
          console.error('Error fetching DescribeFeatureType:', error);
        });
    }
  }
}
