import { BingMaps, OSM, TileWMS, XYZ } from 'ol/source';
import ExtendedTileLayer from '../customLayers/extendedTileLayer';
import {
  border_layers,
  ndihma_ekonomike_url_layers,
} from '../url-layers/url-layers';
import { environmentCommon } from 'src/environments/environment.common';

// const wfsLayerUrl =
//   'localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=';
// const wfsLayerUrlEnd = '&maxFeatures=50&outputFormat=application/json';

export const extendedTileLayers = {
  //Biodiversity protection & Conservation
  wildlifeTracking: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:wildlife_tracking',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Wildlife tracking',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  plantsTracking: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:plants_tracking',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Plants Tracking',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  illegalPoaching: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:illegal_poaching',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Illegal Poaching',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  //Park Management Monitoring
  waterLevelMonitoring: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:water_level_monitoring',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Water Level Monitoring',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  fire: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:fire',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Fire',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  illegalLogging: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:illegal_logging',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Illegal Logging',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),

  wasteManagement: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:waste_management',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Waste Management',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  erosion: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:erosion',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Erosion',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  //Sustainable Tourism
  accommodation: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:accommodation',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Accommodation',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),

  localBusinesses: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:local_businesses',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Local Businesses',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),

  tourismActivitiesSports: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:toursists_activities_sports',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Tourist Activities/Sports',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),

  infoCenter: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:info_center',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Info Center',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),

  facilities: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:facilities',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Facilities',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),

  //Infrastructure
  hikingTrails: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:hiking_trails',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Hiking Trails',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  roads: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:roads',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Roads',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  //Additional Layers
  protectedAreas: new ExtendedTileLayer({
    source: new TileWMS({
      url: ndihma_ekonomike_url_layers.protected_areas,
      params: {
        CQL_FILTER: 'ogc_fid IN (25, 158, 179)',
        LAYERS: 'zonat_e_mbrojtura_natyrore_06042023',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Protected Areas',
    information: 'Protected Areas',
    displayInLayerSwitcher: true,
  }),
  north_macedonia_border: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:macedonia_border_reprojected',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'North Macedonia Border',
    information: 'North Macedonia Border',
    displayInLayerSwitcher: true,
  }),
  kufiri_mavrove: new ExtendedTileLayer({
    source: new TileWMS({
      url: environmentCommon.url,
      params: {
        LAYERS: 'test:kufiri_mavrove',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'Mavrove Border',
    information: 'Mavrove Border',
    displayInLayerSwitcher: true,
  }),
  naturalMonuments: new ExtendedTileLayer({
    source: new TileWMS({
      url: ndihma_ekonomike_url_layers.natural_monuments,
      params: {
        LAYERS: 'monumentet_natyrore_07032023',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Monumente Natyrore',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  roadNetwork: new ExtendedTileLayer({
    source: new TileWMS({
      url: ndihma_ekonomike_url_layers.road_network,
      params: {
        LAYERS: 'infrastruktura_rrugore_utm',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Rrjeti Rrugor',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),

  albBorders: new ExtendedTileLayer({
    source: new TileWMS({
      url: border_layers.alb_borders,
      params: {
        LAYERS: 'rendi_1_kufi_shteteror',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'State Border',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  albRegions: new ExtendedTileLayer({
    source: new TileWMS({
      url: border_layers.alb_regions,
      params: {
        LAYERS: 'rendi_2_kufi_qarku_vkm360',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Qark',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),
  municipalities: new ExtendedTileLayer({
    source: new TileWMS({
      url: border_layers.alb_municipalities,
      params: {
        LAYERS: 'rendi_3_kufi_bashki_vkm360_1',
        VERSION: '1.1.0',
      },
      crossOrigin: 'anonymous',
    }),
    visible: false,
    title: 'Bashki',
    information: 'Description here...',
    displayInLayerSwitcher: true,
  }),

  //BASE MAPS
  openstreetMapStandardLayer: new ExtendedTileLayer({
    source: new OSM(),
    visible: false,
  }),
  bingMaps: new ExtendedTileLayer({
    source: new BingMaps({
      placeholderTiles: true,
      key: 'AvHGkUYsgRR4sQJ1WmqJ879mN7gP-a59ExxkaD9KXDie-8nyYX4W9oSnG4ozmDXB',
      imagerySet: 'AerialWithLabelsOnDemand',
    }),

    visible: false,
    title: 'BingMaps',
    baseLayer: true,
    displayInLayerSwitcher: true,
  }),
  osmMap: new ExtendedTileLayer({
    source: new OSM(),
    title: 'OSM',
    visible: false,
    baseLayer: true,
    displayInLayerSwitcher: true,
  }),
  cartoDBBaseLayer: new ExtendedTileLayer({
    source: new XYZ({
      url: border_layers.carto_db_base_layer,
      attributions: '© CARTO',
      crossOrigin: 'anonymous',
    }),
    visible: true,
    title: 'CartoDarkAll',
    baseLayer: true,
    displayInLayerSwitcher: true,
  }),
};
