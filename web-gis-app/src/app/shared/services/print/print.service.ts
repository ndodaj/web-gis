import { Injectable, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import CanvasAttribution from 'ol-ext/control/CanvasAttribution';
import CanvasTitle from 'ol-ext/control/CanvasTitle';
import { Options } from 'ol-ext/control/SearchNominatim';
import { EventTypes } from 'ol/Observable';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { customStyles } from '@shared/ol/customStyles/customStyles';
import { GraticuleService } from '../graticule.service';
import ExtendedPrintDialog from '@shared/ol/customLayers/extendedPrintControl';
import Graticule from 'ol-ext/control/Graticule';
import { Graticule as OlGraticule } from 'ol';

@Injectable({
  providedIn: 'root',
})
export class PrintService implements OnInit {
  printControl = new ExtendedPrintDialog({
    immediate: true,
    collapsed: false,
  });

  constructor(
    public mapService: MapService,
    public graticuleService: GraticuleService
  ) {}

  ngOnInit(): void {}

  printControl2() {
    console.log('printcontrol2');

    this.mapService
      .getMap()
      .addControl(new CanvasAttribution({ canvas: true }));
    console.log('dddd');

    this.mapService.getMap().addControl(
      new CanvasTitle(<Options & { [prop: string]: any }>{
        title: 'my title',
        visible: false,
        style: customStyles.printControl2Style,
      })
    );
    //this.mapService.getMap().addControl(new CanvasScaleLine());
  }

  printDialog() {
    console.log('printlog');

    const printBtn = document.querySelector('.print-dialog');
    const closeBtn = document.querySelector(
      '.ol-ext-dialog > form.ol-closebox .ol-closebox'
    );
    const printDialog = new ExtendedPrintDialog({
      className: 'print-dialog',
      title: 'Printo Hartën',
      targetDialog: document.getElementById('map'),
      openWindow: true,
    });

    // Add custom graticule toggle
    const customLi = document.createElement('li');
    customLi.className = 'ol-graticule-toggle';
    customLi.innerHTML = `
        <label class="ol-ext-toggle-switch">
          Show Coordinates
          <input type="checkbox" id="graticuleToggle">
          <span></span>
        </label>
      `;
    console.log(customLi);

    // Append custom li to print dialog
    const printParamList = document.querySelector('.ol-print-param ul');
    console.log(printParamList);

    printParamList?.insertBefore(
      customLi,
      document.querySelector('.ol-print-title')
    );
    const graticuleToggle = document.getElementById(
      'graticuleToggle'
    ) as HTMLInputElement;

    graticuleToggle?.addEventListener('change', () => {
      console.log(graticuleToggle.checked);

      if (graticuleToggle.checked) {
        this.graticuleService.showGraticule();
      } else {
        this.graticuleService.removeGraticule();
      }
    });
    closeBtn?.addEventListener('click', () => {
      if (graticuleToggle.checked) {
        graticuleToggle.checked = false;
      }

      this.graticuleService.removeGraticule();
    });
    printBtn?.addEventListener('click', () => {
      this.mapService
        .getMap()
        .getControls()
        .forEach((control) => {
          if (control instanceof Graticule) {
            this.mapService.getMap().removeControl(control);
          } else if (control instanceof OlGraticule) {
            this.mapService.getMap().removeControl(control);
          }
        });
      this.mapService.getMap().addControl(printDialog);
      console.log(this.mapService.map.getControls());
      const cancelButton = document.querySelector(
        ".ol-ext-buttons button[type='button']"
      );
      cancelButton?.addEventListener('click', () => {
        console.log('cancel');

        this.mapService.getMap().removeControl(printDialog);
      });
    });
  }

  onPrint() {
    this.printControl.on(['print', 'error'] as EventTypes[], (e: any) => {
      if (e.image) {
        if (e.pdf) {
          const pdf = new jsPDF({
            orientation: e.print.orientation,
            unit: e.print.unit,
            format: e.print.size,
          });
          pdf.addImage(
            e.image,
            'JPEG',
            e.print.position[0],
            e.print.position[0],
            e.print.imageWidth,
            e.print.imageHeight
          );
          pdf.save(e.print.legend ? 'legend.pdf' : 'map.pdf');
        } else {
          e.canvas.toBlob(
            (blob: any) => {
              var name = 'title 1';
              saveAs(blob, name);
            },
            e.imageType,
            e.quality
          );
        }
      } else {
        console.warn('No canvas to export');
      }
    });
  }
}
