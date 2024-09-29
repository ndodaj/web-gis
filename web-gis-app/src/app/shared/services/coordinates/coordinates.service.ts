import { Injectable } from '@angular/core';
import { MapService } from '../map.service';
import { StyleService } from '../style.service';
import { transform } from 'ol/proj';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PropertiesDialogComponent } from './components/properties.components';
import ExtendedTileLayer from '@shared/ol/customLayers/extendedTileLayer';
import { TileWMS } from 'ol/source';
import ExtendedLayerGroup from '@shared/ol/customLayers/extendedLayerGroup';
@Injectable({
  providedIn: 'root',
})
export class CoordinatesService {
  ref: DynamicDialogRef | undefined;
  layerGroups: any = [];
  constructor(
    public mapService: MapService,
    public styleService: StyleService,

    public dialogService: DialogService
  ) {}

  clearDrawInteraction() {
    this.mapService.getMap().removeInteraction(this.styleService.getDrawPoly());
    this.mapService.getMap().removeInteraction(this.styleService.getDrawLine());
    this.styleService.drawnPolygonSource.clear();
    this.styleService.drawnLineSource.clear();
  }
  readGroupLayers(grouplayers: any) {
    return grouplayers.filter((layer: any) => layer.getVisible()).reverse();
  }
  getInfo = (event: any) => {
    this.ref?.destroy();
    this.layerGroups = [];
    this.clearDrawInteraction();
    const pixel = event.pixel;
    const coordinate = this.mapService.getMap().getCoordinateFromPixel(pixel);
    //let visibleLayers: any[] = [];

    const layers = this.readGroupLayers(
      this.mapService.getMap().getLayers().getArray()
    );
    //console.log(layers);
    layers.forEach((layerGroup: any) => {
      if (
        layerGroup.get('title') !== 'Base Layers' &&
        layerGroup.get('title') !== 'Additional Layers'
      ) {
        this.layerGroups.push(layerGroup);
      }
    });

    if (this.layerGroups.length > 0) {
      this.getLayerFeatures(this.layerGroups, this.layerGroups[0], coordinate);
    }
  };
  getLayerTitle(layer: any) {
    return layer.get('title') || '';
  }
  getLayerFeatures = (layers?: any, layer?: any, coordinate?: any) => {
    layer
      ?.getLayers()
      ?.getArray()
      .forEach((el: any) => {
        const url = el
          ?.getSource()
          ?.getFeatureInfoUrl(
            coordinate,
            this.mapService.getMap().getView().getResolution(),
            this.mapService.getMap().getView().getProjection(),
            { INFO_FORMAT: 'application/json' }
          );

        if (url) {
          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              const features = data?.features;

              if (features && features.length > 0) {
                features.forEach((feature: any) => {
                  const properties = feature.properties;

                  const layerTitleName = this.getLayerTitle(el);
                  this.ref = this.dialogService.open(
                    PropertiesDialogComponent,
                    {
                      data: properties,
                      header: layerTitleName,
                      modal: false,
                      position: 'left',
                      width: '250px',

                      dismissableMask: false,
                      keepInViewport: false,
                    }
                  );
                });
              } else {
                const nextLayerIndex = layers.indexOf(layer) + 1;
                //console.log(nextLayerIndex);

                if (nextLayerIndex < layers.length) {
                  this.getLayerFeatures(layers[nextLayerIndex]);
                } else {
                  const formContainer =
                    document.querySelector<HTMLElement>('.form-container');
                  formContainer!.style.display = 'none';
                }
              }
            })
            .catch(function (error) {
              console.error('Error:', error);
            });
        }
      });
  };
  decimalToDMS(decimal: number) {
    const degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;
    return degrees + '° ' + minutes + "' " + seconds.toFixed(2) + "''";
  }

  getXY = (event: any) => {
    const coordsModal = document.querySelector('#myModal')!;
    const krgjshCoords = event.coordinate;

    const wgs84 = 'EPSG:4326';
    const utm34N = 'EPSG:32634';
    const transformedCoordinate = transform(
      krgjshCoords,
      this.mapService.getMap().getView().getProjection(),
      wgs84
    );
    const latitudeDMS = this.decimalToDMS(transformedCoordinate[0]);
    const longitudeDMS = this.decimalToDMS(transformedCoordinate[1]);
    const transformedCoordinate2 = transform(
      krgjshCoords,
      this.mapService.getMap().getView().getProjection(),
      utm34N
    );

    document.getElementById('easting')!.textContent =
      krgjshCoords[0].toFixed(2);
    document.getElementById('northing')!.textContent =
      krgjshCoords[1].toFixed(2);
    document.getElementById('easting1')!.textContent = latitudeDMS;
    document.getElementById('northing1')!.textContent = longitudeDMS;
    document.getElementById('easting2')!.textContent =
      transformedCoordinate2[0].toFixed(2);
    document.getElementById('northing2')!.textContent =
      transformedCoordinate2[1].toFixed(2);

    coordsModal.classList.add('myModal');
  };

  getInfoClickListener = (event: any) => {
    this.getInfo(event);
  };

  getFeatureInfo = (event: any) => {
    this.singleClick(event);
  };

  singleClick = (event?: any) => {
    this.ref?.destroy();

    let featureFound = false;

    // Iterate through layer groups
    this.mapService
      .getMap()
      .getLayers()
      .forEach((layerGroup) => {
        if (
          layerGroup instanceof ExtendedLayerGroup &&
          layerGroup.get('title') !== 'Base Layers' &&
          layerGroup.get('title') !== 'Additional Layers'
        ) {
          // Iterate through layers within the layer group
          layerGroup.getLayers().forEach((layer) => {
            if (
              layer instanceof ExtendedTileLayer &&
              layer.getSource() instanceof TileWMS &&
              layer?.isVisible()
            ) {
              // Handle WMS layers
              const viewResolution = this.mapService
                .getMap()
                .getView()
                .getResolution()!;
              const url = (layer.getSource() as TileWMS).getFeatureInfoUrl(
                event.coordinate,
                viewResolution,
                this.mapService.getMap().getView().getProjection(),
                {
                  INFO_FORMAT: 'application/json',
                  FEATURE_COUNT: 1,
                }
              )!;

              fetch(url)
                .then((response) => response.json())
                .then((data) => {
                  if (data?.features?.length > 0) {
                    featureFound = true;
                    const properties = data?.features[0]?.properties;

                    const layerTitleName = this.getLayerTitle(layer);
                    this.ref = this.dialogService.open(
                      PropertiesDialogComponent,
                      {
                        data: properties,
                        header: layerTitleName,
                        modal: false,
                        position: 'left',
                        width: '250px',

                        dismissableMask: false,
                        keepInViewport: false,
                      }
                    );
                    // Update popup content or handle the feature properties
                  }
                })
                .catch((error) =>
                  console.error('Error fetching feature info:', error)
                );
            }
          });
        }
      });

    if (!featureFound) {
      console.log(featureFound);
    }
  };

  getXYClickListener = (event: any) => {
    this.getXY(event);
  };
}
