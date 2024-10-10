import { Injectable, OnInit } from '@angular/core';
import PrintDialog from 'ol-ext/control/PrintDialog';
import { MapService } from '../map.service';
import CanvasAttribution from 'ol-ext/control/CanvasAttribution';
import CanvasTitle from 'ol-ext/control/CanvasTitle';
import { Options } from 'ol-ext/control/SearchNominatim';
import CanvasScaleLine from 'ol-ext/control/CanvasScaleLine';
import { EventTypes } from 'ol/Observable';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { customStyles } from '@shared/ol/customStyles/customStyles';

@Injectable({
  providedIn: 'root',
})
export class PrintService implements OnInit {
  printControl = new PrintDialog({
    immediate: true,
    collapsed: false,
  });

  constructor(public mapService: MapService) {}

  ngOnInit(): void {}

  printControl2() {
    this.mapService
      .getMap()
      .addControl(new CanvasAttribution({ canvas: true }));
    this.mapService.getMap().addControl(
      new CanvasTitle(<Options & { [prop: string]: any }>{
        title: 'my title',
        visible: false,
        style: customStyles.printControl2Style,
      })
    );
    this.mapService.getMap().addControl(new CanvasScaleLine());
  }

  printDialog() {
    const printBtn = document.querySelector('.print-dialog');
    const printDialog = new PrintDialog({
      className: 'print-dialog',
      title: 'Printo Hartën',
      targetDialog: document.getElementById('map'),
      openWindow: true,
    });
    printBtn?.addEventListener('click', () => {
      this.mapService.getMap().addControl(printDialog);
      const cancelButton = document.querySelector(
        ".ol-ext-buttons button[type='button']"
      );
      cancelButton?.addEventListener('click', () => {
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
