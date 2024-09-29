import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Rotate, ZoomSlider, ZoomToExtent } from 'ol/control';
import DragRotate from 'ol/interaction/DragRotate.js';
import { altKeyOnly } from 'ol/events/condition';
import { Draw } from 'ol/interaction';
import ExtendedTileLayer from '@shared/ol/customLayers/extendedTileLayer';
import { WMTSCapabilities } from 'ol/format';
import PrintDialog from 'ol-ext/control/PrintDialog';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import { attributions } from '@shared/ol/attributions/attributions';
import { fullScreen } from '@shared/ol/fullScreenControls/fullScreenControls';
import { extendedLayerGroup } from '@shared/ol/extendedLayerGroup/extendedLayerGroup';
import { MapService } from '@shared/services/map.service';
import { StyleService } from '@shared/services/style.service';
import { ScaleService } from '@shared/services/scale/scale.service';
import { CoordinatesService } from '@shared/services/coordinates/coordinates.service';
import { LayerControlService } from '@shared/services/layer-control/layer-control.service';
import { PrintService } from '@shared/services/print/print.service';

import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

// proj4.defs(
//   'EPSG:6870',
//   '+proj=tmerc +lat_0=0 +lon_0=20 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
// );
// register(proj4);
proj4.defs(
  'EPSG:32634',
  '+proj=utm +zone=34 +datum=WGS84 +units=m +no_defs +type=crs'
);

register(proj4);
const wmts_parser = new WMTSCapabilities();

@Component({
  selector: 'app-gis-map',
  templateUrl: './gis-map.component.html',
  styleUrls: ['./gis-map.component.scss'],
})
export class GisMapComponent implements OnInit, OnDestroy {
  newItem!: any;
  legend!: any;
  drawLine!: Draw;
  drawPoly!: Draw;
  public toggle: boolean = false;

  @ViewChild('popupContent', { static: true }) popupContent!: ElementRef;
  @ViewChild('lon', { static: true }) lon!: ElementRef;
  @ViewChild('lat', { static: true }) lat!: ElementRef;

  zoomExtend = new ZoomToExtent({
    extent: [
      436491.7581433204, 4387154.944425966, 591637.9267314437,
      4731041.924406727,
    ],
  });

  zoomSlider = new ZoomSlider();

  rotate = new Rotate();
  mapControls = [
    this.zoomExtend,
    attributions.attributionControl,
    this.zoomSlider,
    fullScreen.fullScreenControl,

    this.rotate,
  ];
  dragRotateInteraction = new DragRotate({
    condition: altKeyOnly,
  });

  layerGroups = [];

  printControl = new PrintDialog({
    immediate: true,
    collapsed: false,
  });
  layers: any;

  layerSwitcher = new LayerSwitcher();
  maxPropertiesToShow = 10;

  constructor(
    public mapService: MapService,
    public styleService: StyleService,
    public scaleService: ScaleService,
    public coordsService: CoordinatesService,
    public layerControlService: LayerControlService,
    public printService: PrintService,
    public vcRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.mapService
      .getLayerGroupsGeo()
      .then((response: any) => {
        response?.data?.layerGroups?.layerGroup?.forEach((layergroup: any) => {
          const layerGroupInfo =
            this.mapService.constructLayerGroup(layergroup);

          this.mapService.getMap().addLayer(layerGroupInfo);

          this.mapService
            .getLayersFromEachLayerGroupGeo(layerGroupInfo.get('title'))
            .then((response: any) => {
              const layers =
                response?.data?.layerGroup?.publishables?.published;
              const normalizedLayers = Array.isArray(layers)
                ? layers
                : [layers];
              normalizedLayers.forEach((element: any) => {
                const name = element?.name?.split(':')[1];
                //layerGroupInfo.getLayers().push()
                this.mapService
                  .getLayersGeo(name)
                  .then((response: any) => {
                    //this.mapService.constructTileLayer(response?.data);
                    layerGroupInfo
                      .getLayers()
                      .push(this.mapService.constructTileLayer(response?.data));

                    this.mapService.addItemToLegend();

                    this.mapService.hasVisibleSubLayer(layerGroupInfo);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
            })
            .catch((error) => {
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });

    this.mapService.createMap();

    this.mapService.getMap().addInteraction(this.dragRotateInteraction);

    this.mapService.getMap().addInteraction(this.styleService.modify);
    this.mapService.getMap().addControl(this.mapService.layerSwitcher);
    this.mapService.getMap().addControl(this.printService.printControl);

    this.layerControlService.layerSelectionChange();
    this.layerControlService.operatorSelect();

    this.scaleService.calculateScale();

    this.printService.printControl.setSize('A4');
    this.printService.printControl.setOrientation('landscape');
    this.printService.printControl.setMargin(5);
    this.printService.printControl['element'].click();
    this.printService.printDialog();
    this.printService.printControl2();
    this.printService.onPrint();

    this.updateScaleOnChange();
    this.onSubmitBtn();
    this.onResetBtn();
    this.onFieldSelectionChange();
    this.fieldSelectionChange();
    this.getOrtofoto2015();

    this.mapService.getMap().addControl(this.mapService.legendCtrl);
  }

  closeInfoForm() {
    const closeForm = document.getElementById('formContainer')!;
    closeForm.style.display = 'none';
  }

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  getOrtofoto2015() {
    fetch('https://geoportal.asig.gov.al/service/wmts?request=getCapabilities')
      .then((response) => {
        return response.text();
      })
      .then(function (text) {
        const result = wmts_parser.read(text);
        const opt_ortho_2015_20 = optionsFromCapabilities(result, {
          layer: 'orthophoto_2015:OrthoImagery_20cm',
          matrixSet: 'EPSG:6870',
        });

        const ortho = new ExtendedTileLayer({
          name: 'Ortofoto 2015 20cm',
          shortName: '2015 20cm',

          visible: false,
          source: new WMTS(opt_ortho_2015_20!),
          title: 'Ortofoto 2015 20cm',
          baseLayer: true,
          displayInLayerSwitcher: true,
          crossOrigin: 'anonymous',
        });

        extendedLayerGroup.baseLayerGroup.getLayers().push(ortho);
        // Now you can use the 'ortho' variable outside the fetch scope
        // For example, you can access it here or in any other part of your code
      })

      .catch(() => {
        // Handle errors if necessary
      });
  }

  updateScaleOnChange() {
    const view = this.mapService.getMap().getView();
    view.on('change', () => {
      this.scaleService.calculateScale();
    });
  }

  closeModal() {
    const coordsModal = document.getElementById('myModal')!;
    coordsModal.classList.remove('myModal');
  }

  closeSelectControlModal() {
    const selectControlForm = document.querySelector(
      '.selectControl'
    ) as HTMLInputElement;
    selectControlForm.hidden = true;
  }

  onSubmitBtn() {
    const sumbmitBtn = document.getElementById('sumbmitBtn');
    sumbmitBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.layerControlService.filterCQL();
    });
  }
  onResetBtn() {
    const resetBtn = document.getElementById('resetBtn');
    resetBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.layerControlService.resetFilter();
    });
  }

  fieldSelectionChange() {
    const fieldSelect = document.getElementById(
      'fieldSelect'
    ) as HTMLInputElement;

    fieldSelect?.addEventListener('change', () => {
      this.layerControlService.updateOperatorOptions();
      this.layerControlService.getAttributeValues();
    });
  }

  onFieldSelectionChange() {
    const fieldSelect = document.getElementById(
      'fieldSelect'
    ) as HTMLInputElement;

    fieldSelect.addEventListener('change', () => {
      this.layerControlService.updateOperatorOptions();
      this.layerControlService.getAttributeValues();
    });
  }

  ngOnDestroy() {
    // Cleanup tasks when component is destroyed
    if (this.mapService.getMap()) {
      // Dispose of map resources
      this.mapService.getMap().dispose();
    }
    // Add cleanup logic for other resources if needed
  }
}
