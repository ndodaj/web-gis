import ExtendedLayerGroup from '../customLayers/extendedLayerGroup';
import { extendedTileLayers } from '../extendedTileLayer/extendedTileLayer';

export const extendedLayerGroup = {
  baseLayerGroup: new ExtendedLayerGroup({
    layers: [
      extendedTileLayers.cartoDBBaseLayer,
      extendedTileLayers.bingMaps,
      extendedTileLayers.osmMap,
    ],
    title: 'Base Layers',
    information: 'These base map layers which can be activated separately',
    displayInLayerSwitcher: true,
  }),
  additionalLayers: new ExtendedLayerGroup({
    layers: [
      extendedTileLayers.albBorders,
      // extendedTileLayers.albRegions,
      // extendedTileLayers.municipalities,
      extendedTileLayers.protectedAreas,
      extendedTileLayers.north_macedonia_border,
      extendedTileLayers.kufiri_mavrove,
      // extendedTileLayers.naturalMonuments,
      // extendedTileLayers.roadNetwork,
    ],
    title: 'Additional Layers',
    information: 'These base map layers which can be activated separately',
    displayInLayerSwitcher: true,
  }),
  infrastructureLayers: new ExtendedLayerGroup({
    layers: [extendedTileLayers.hikingTrails, extendedTileLayers.roads],
    title: 'Infrastructure',
    information: 'Infrastructure',
    displayInLayerSwitcher: true,
  }),
  biodiversityprotectionConservation: new ExtendedLayerGroup({
    layers: [
      extendedTileLayers.plantsTracking,
      extendedTileLayers.wildlifeTracking,
      extendedTileLayers.illegalPoaching,
    ],
    title: 'Biodiversity Protection & Conservation',
    information: 'Biodiversity Protection & Conservation',
    displayInLayerSwitcher: true,
  }),
  parkManagementmonitoring: new ExtendedLayerGroup({
    layers: [
      extendedTileLayers.waterLevelMonitoring,
      extendedTileLayers.fire,
      extendedTileLayers.erosion,
      extendedTileLayers.illegalLogging,
      extendedTileLayers.wasteManagement,
    ],
    title: 'Park Management Monitoring',
    information: 'Park Management Monitoring',
    displayInLayerSwitcher: true,
  }),
  sustainabletourism: new ExtendedLayerGroup({
    layers: [
      extendedTileLayers.accommodation,
      extendedTileLayers.localBusinesses,
      extendedTileLayers.tourismActivitiesSports,
      extendedTileLayers.infoCenter,
      extendedTileLayers.facilities,
    ],
    title: 'Sustainable Tourism',
    information: 'Sustainable Tourism',
    displayInLayerSwitcher: true,
  }),
};
