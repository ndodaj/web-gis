import { Injectable } from '@angular/core';
import { attributions } from '@shared/ol/attributions/attributions';
import { dragPan } from '@shared/ol/dragPan/dragPan';
import { extendedLayerGroup } from '@shared/ol/extendedLayerGroup/extendedLayerGroup';
import { fullScreen } from '@shared/ol/fullScreenControls/fullScreenControls';
import { geo_search } from '@shared/ol/url-layers/url-layers';
import { Feature, Map, View } from 'ol';
import SearchNominatim, { Options } from 'ol-ext/control/SearchNominatim';

import { Control, Rotate, defaults } from 'ol/control';
import { LayerControlService } from './layer-control/layer-control.service';
import LayerGroup from 'ol/layer/Group';
import ExtendedLayerSwitcher from '@shared/ol/customLayers/extendedLayerSwithcer';
import { Draw, Select } from 'ol/interaction';
import ExtendedLayerGroup from '@shared/ol/customLayers/extendedLayerGroup';
import { Icon, Style } from 'ol/style';
import ExtendedTileLayer from '@shared/ol/customLayers/extendedTileLayer';
import ExtendedLegend from '@shared/ol/customLayers/extendedLegend';
import CTRLLegend from 'ol-ext/control/Legend';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TileWMS } from 'ol/source';
import { environmentCommon } from 'src/environments/environment.common';
import axios from 'axios';
import { AppConfigService } from '@core/services/app-config.service';
import { BaseService } from '@core/api/base-service';
import TileLayer from 'ol/layer/Tile';
import { getPointResolution } from 'ol/proj';
import { Circle } from 'ol/geom';
import { fromCircle } from 'ol/geom/Polygon';
import ExtendedVectorSource from '@shared/ol/customLayers/extendedVectorSource';
import ExtendedVectorLayer from '@shared/ol/customLayers/extendedVectorLayer';

@Injectable({
  providedIn: 'root',
})
export class MapService extends BaseService {
  map!: Map;
  newItem!: any;
  geoSearch = new SearchNominatim(<Options & { [prop: string]: any }>{
    placeholder: 'Search...',
    collapsed: true,
    collapsible: false,
    url: geo_search.geo_search,
  });
  layerGroups = [extendedLayerGroup.additionalLayers];
  draw!: Draw;
  legend = new ExtendedLegend({
    title: 'Legend',
    items: [this.manageLegendItems()],
  });

  legendCtrl = new CTRLLegend({
    legend: this.legend,
    collapsed: true,
    collapsible: true,
  });
  // legend = new ExtendedLegend({
  //   title: 'Legend',
  //   items: [this.manageLegendItems()],
  // });
  // legendCtrl = new CTRLLegend({
  //   legend: this.legend,
  //   collapsed: true,
  //   collapsible: true,
  // });
  layerSwitcher!: any;
  center: any;
  polygonFromCircle: any;

  constructor(
    public layerControlService: LayerControlService,
    private http: HttpClient,
    config: AppConfigService
  ) {
    super(config);

    this.layerSwitcher = new ExtendedLayerSwitcher({
      selection: true,
      displayInLayerSwitcher: this.displayInLayerSwitcher,
      show_progress: true,
      mouseover: true,
      reordering: true,

      trash: false,

      oninfo: (e) => {
        alert(e['values_'].information);
      },

      onchangeCheck: this.onChangeCheck,
      collapsed: false,
      noScroll: false,
    });

    const treePanelHeader = document.createElement('header');

    treePanelHeader.innerHTML = 'INDICATORS';
    this.layerSwitcher.setHeader(treePanelHeader);
    const layerSwitcherElement = this.layerSwitcher['element'];
    //const btn = layerSwitcherElement.getElementsByTagName('button');
    layerSwitcherElement.classList;
    layerSwitcherElement.style.position = 'absolute';
    layerSwitcherElement.style.top = '0.5em';
    layerSwitcherElement.style.left = 'auto';

    this.layerSwitcher.on('select', () => {
      this.map.getInteractions().forEach((interaction) => {
        if (interaction instanceof Draw) {
          this.map.removeInteraction(interaction);
        } else if (interaction instanceof Select) {
          this.map.removeInteraction(interaction);
        }
      });
    });
  }

  findParentLayerGroup(layer: any): LayerGroup {
    let parentLayerGroup: any = null;
    this.map.getLayers().forEach((group) => {
      if (group instanceof LayerGroup) {
        const layersInGroup = group.getLayers().getArray();
        if (layersInGroup.includes(layer)) {
          parentLayerGroup = group;
          return;
        }
      }
    });
    return parentLayerGroup!;
  }

  // @ts-ignore
  hasVisibleSubLayer = (layerGroup) => {
    if (!(layerGroup instanceof LayerGroup)) {
      return false;
    }
    const layers = layerGroup.getLayers().getArray();
    let isAnySubLayerVisible = false;
    layers.forEach((subLayer) => {
      if (subLayer.getVisible()) {
        isAnySubLayerVisible = true;
      }
    });
    layerGroup.setVisible(isAnySubLayerVisible);
  };

  onChangeCheck = (evt: any) => {
    const clickedLayer = evt;

    const parentLayerGroup = this.findParentLayerGroup(clickedLayer);
    if (parentLayerGroup && clickedLayer.getVisible()) {
      parentLayerGroup.setVisible(true);
    } else if (parentLayerGroup && this.hasVisibleSubLayer(parentLayerGroup)) {
      parentLayerGroup.setVisible(false);
    }
    const baseLayer = clickedLayer.get('title') === 'Base Layers';
    try {
      const layers = evt.getLayers().getArray();
      layers.forEach((subLayer: any) => {
        if (
          clickedLayer instanceof ExtendedLayerGroup &&
          clickedLayer.getVisible() === true &&
          !baseLayer
        ) {
          subLayer.setVisible(true);
        } else {
          subLayer.setVisible(false);
        }
      });

      this.layerControlService.addLayerToQuery(
        this.map
          .getAllLayers()
          // Filter only visible layers
          .filter((layer) => layer.getVisible())
          // Map to get the layer objects
          .map((layer) => layer)
      );
      this.layerControlService.getFields();
      this.addItemToLegend();
    } catch (error) {}
    // this.layerControlService.addLayerToQuery();
    // this.layerControlService.getAttributeValues();
    // this.layerControlService.getFields();
    this.layerControlService.addLayerToQuery(
      this.map
        .getAllLayers()
        // Filter only visible layers
        .filter((layer) => layer.getVisible())
        // Filter layers with specific titles
        .filter((layer) => {
          const title = layer.get('title');

          return (
            title !== 'CartoDarkAll' &&
            title !== 'State Border' &&
            title !== 'Protected Areas' &&
            title !== 'BingMap' &&
            title !== 'OSM' &&
            title !== 'Ortofoto 2015 20cm'
          );
        })
    );
    this.layerControlService.getFields();
    this.addItemToLegend();
  };

  displayInLayerSwitcher = (layer: any) => {
    return layer.get('displayInLayerSwitcher') === true;
  };

  createMap() {
    const rotate = new Rotate();

    const mapControls = [
      attributions.attributionControl,
      fullScreen.fullScreenControl,

      rotate,
      dragPan,
    ];

    //const krgjshCenter = fromLonLat([19.818913, 41.328608], 'EPSG:6870');

    //const utmCenter = [413011.607371, 4564155.943308];
    // const extent = transformExtent(
    //   [-180, -90, 180, 90],
    //   'EPSG:4326',
    //   'EPSG:3857'
    // ); // Example extent covering the whole world
    //const resolution = View.(this.map.getSize(), extent).getWidth() / 1024;
    this.map = new Map({
      layers: [
        extendedLayerGroup.baseLayerGroup,
        extendedLayerGroup.additionalLayers,
      ],
      target: 'map',
      controls: defaults({ attribution: false }).extend(
        mapControls as Control[]
      ),

      view: new View({
        projection: 'EPSG:3857',
        center: [2206144.619624, 5060991.189047],
        zoom: 7.5,
        maxZoom: 20,
        minZoom: 7.5,
      }),
    });

    // if (this.map.getLayers().getArray().length > 2) {
    //   this.manageLegendItems(this.map.getLayers().getArray().map);
    // }
  }

  getMap(): Map {
    return this.map;
  }
  manageLegendItems(layer?: any) {
    if (layer instanceof ExtendedLayerGroup) {
      const layers = layer.getLayers().getArray();

      layers.forEach((subLayer: any) => {
        if (subLayer.getVisible()) {
          this.newItem = {
            title: subLayer.get('title'),
            typeGeom: 'Point',
            style: new Style({
              image: new Icon({
                src: subLayer.getSource().getLegendUrl(),
                // crossOrigin: "anonymous",
              }),
            }),
          };
          this.legend.addItem(this.newItem);
        }
      });
    } else if (layer instanceof TileLayer) {
      if (layer?.getVisible()) {
        this.newItem = {
          title: layer.get('title'),
          typeGeom: 'Point',
          style: new Style({
            image: new Icon({
              src: layer?.getSource()?.getLegendUrl()!,
              // crossOrigin: "anonymous",
            }),
          }),
        };
        this.legend.addItem(this.newItem);
      }
    }
  }

  readGroupLayers(grouplayers: any) {
    return grouplayers.filter((layer: any) => layer.getVisible()).reverse();
  }
  addItemToLegend() {
    this.legend.getItems().clear();
    const layers = this.readGroupLayers(this.getMap().getLayers().getArray());

    layers.forEach((layerGroup: any) => {
      if (
        layerGroup.get('title') !== 'Base Layers' &&
        layerGroup.get('title') !== 'Additional Layers'
      ) {
        this.manageLegendItems(layerGroup);
      }
    });
  }

  // addPanelHeader() {
  //   this.printService.panelHeader();
  // }
  getLayerGroups(layerGroups: any) {
    return layerGroups;
  }

  getLayerGroupsGeo() {
    // Replace 'your_username' and 'your_password' with your actual GeoServer credentials
    const username = 'geobeyond';
    const password = 'myawesomegeoserver';

    // Create base64 encoded credentials
    const credentials = btoa(username + ':' + password);
    return axios.get(
      `${this.geoserverUrl}/geoserver/rest/workspaces/test/layergroups`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + credentials,
        },
      }
    );
  }

  getLayerGroupsFromGeoserver(): Observable<any> {
    const apiUrl = `${this.geoserverUrl}/geoserver/rest/workspaces/test/layergroups`;

    // Replace 'your_username' and 'your_password' with your actual GeoServer credentials
    const username = 'geobeyond';
    const password = 'myawesomegeoserver';

    // Create base64 encoded credentials
    const credentials = btoa(username + ':' + password);

    // Set up headers including the Authorization header with Basic authentication
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + credentials,
    });

    // Make the HTTP GET request with the custom headers
    return this.http.get<any>(apiUrl, { headers: headers });
  }
  getLayersFromEachLayerGroupGeo(layergroup: any) {
    // Replace 'your_username' and 'your_password' with your actual GeoServer credentials
    const username = 'geobeyond';
    const password = 'myawesomegeoserver';

    // Create base64 encoded credentials
    const credentials = btoa(username + ':' + password);
    return axios.get(
      `${this.geoserverUrl}/geoserver/rest/workspaces/test/layergroups/${layergroup}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + credentials,
        },
      }
    );
  }
  getLayersFromEachLayerGroup(layergroup: any): Observable<any> {
    const url = `${this.geoserverUrl}/geoserver/rest/workspaces/test/layergroups/${layergroup}.json`;
    // const url1 = `geoserver/rest/workspaces/test/datastores/test/featuretypes/wildlife_tracking.json`;
    // Replace 'your_username' and 'your_password' with your actual GeoServer credentials
    const username = 'geobeyond';
    const password = 'myawesomegeoserver';

    // Create base64 encoded credentials
    const credentials = btoa(username + ':' + password);

    // Set up headers including the Authorization header with Basic authentication
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + credentials,
    });
    return this.http.get(url, { headers: headers });
  }
  // postLayer(payload: any): Observable<any> {
  //   const username = 'geobeyond';
  //   const password = 'myawesomegeoserver';
  //   const headers = new HttpHeaders({
  //     Authorization: 'Basic ' + btoa(username + ':' + password),
  //   });
  //   const url = `localhost:8080/geoserver/rest/workspaces/test/datastores/test/featuretypes`;
  //   return this.http.post(url, payload, { headers: headers });
  // }
  constructLayerGroup(layerGroupInfo: any): ExtendedLayerGroup {
    const title = layerGroupInfo.name;

    return new ExtendedLayerGroup({
      title: title,
      information: 'These base map layers which can be activated separately',
      displayInLayerSwitcher: true,
    });
  }
  getLayersGeo(layerName: any) {
    // Replace 'your_username' and 'your_password' with your actual GeoServer credentials
    const username = 'geobeyond';
    const password = 'myawesomegeoserver';

    // Create base64 encoded credentials
    const credentials = btoa(username + ':' + password);
    return axios.get(
      `${this.geoserverUrl}/geoserver/rest/workspaces/test/datastores/test/featuretypes/${layerName}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + credentials,
        },
      }
    );
  }
  convertToTitleCase(str: any) {
    return str
      .split('_')
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  // getLayers(layerName: any) {
  //   const url = `localhost:8080/geoserver/rest/workspaces/test/datastores/test/featuretypes/${layerName}.json`;
  //   // Replace 'your_username' and 'your_password' with your actual GeoServer credentials
  //   const username = 'geobeyond';
  //   const password = 'myawesomegeoserver';

  //   // Create base64 encoded credentials
  //   const credentials = btoa(username + ':' + password);

  //   // Set up headers including the Authorization header with Basic authentication
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: 'Basic ' + credentials,
  //   });
  //   return this.http.get(url, { headers: headers });
  // }
  constructTileLayer(layerInfo?: any): ExtendedTileLayer {
    const nameSpace = layerInfo?.featureType?.namespace;
    const title = this.convertToTitleCase(layerInfo?.featureType?.title);
    const layerName = layerInfo?.featureType?.name;
    const description = layerInfo?.featureType?.description;
    //const description = layerInfo.abstract;

    const tileWMSParams = {
      CQL_FILTER: 'accepted = true',
      LAYERS: `${nameSpace?.name}:${layerName}`,
      VERSION: '1.1.0',
      TILED: true,
    };

    const tileWMSOptions = {
      url: environmentCommon.url, // You may need to adjust this
      params: tileWMSParams,
      crossOrigin: 'anonymous',
      buffer: 0.1, // Example buffer of 0.1 map units
      cache: true,
    };

    return new ExtendedTileLayer({
      source: new TileWMS(tileWMSOptions),
      visible: false, // You may want to adjust this based on your logic
      title: title,
      information: description,
      attributes: layerInfo?.featureType?.attributes,
      displayInLayerSwitcher: true,
    });
  }

  getCenterOfExtent(extent?: any) {
    this.center = null;
    const x = extent[0] + (extent[2] - extent[0]) / 2;
    const y = extent[1] + (extent[3] - extent[1]) / 2;
    console.log(x, y);

    this.center = [x, y];
  }
  drawCircleInMeter(radius: number, center: any) {
    var view = this.getMap().getView();
    var projection = view.getProjection();
    var resolutionAtEquator = view.getResolution()!;
    // var center = map.getView().getCenter();
    console.log(center);
    var pointResolution = getPointResolution(
      projection,
      resolutionAtEquator,
      center
    );
    console.log(projection.getMetersPerUnit());
    var resolutionFactor = resolutionAtEquator / pointResolution;
    var radius = (radius / 1) * resolutionFactor;

    var circle = new Circle(center, radius);
    var circleFeature = new Feature(circle);

    // Create a polygon geometry from the circle geometry
    var polygon = fromCircle(circle);

    // Create a feature from the polygon geometry
    this.polygonFromCircle = new Feature(polygon);
    console.log(this.polygonFromCircle);

    var vectorSource = new ExtendedVectorSource({
      projection: 'EPSG:3857',
    });
    vectorSource.addFeature(circleFeature);
    var vectorLayer = new ExtendedVectorLayer({
      source: vectorSource,
    });

    this.getMap().addLayer(vectorLayer);
  }
}
