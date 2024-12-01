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
      const margin = 10; // Increase margin for padding around map
      const date = new Date().toLocaleDateString();
      const logoUrl = 'assets/img/logo-gis.png'; // Path to your logo image
      const description = 'Map description text here lorem ipsum'; // Description text
      const redirectUrl = 'https://your-map-url.com'; // URL for the redirect link

      if (e.image) {
        if (e.pdf) {
          const pdf = new jsPDF({
            orientation: e.print.orientation,
            unit: e.print.unit,
            format: e.print.size,
          });

          // Add the map image with margin
          pdf.addImage(
            e.image,
            'JPEG',
            e.print.position[0] + margin,
            e.print.position[1] + margin,
            e.print.imageWidth - 2 * margin,
            e.print.imageHeight - 2 * margin
          );

          // Add date in the top-right corner
          pdf.setFontSize(10);
          const pageWidth = pdf.internal.pageSize.getWidth();
          pdf.text(`Printed on Date: ${date}`, pageWidth - margin - 50, margin);

          // Load the logo image and add it to the bottom left corner with description
          const logo = new Image();
          logo.src = logoUrl;
          logo.onload = () => {
            const logoWidth = 16;
            const logoHeight = 16;
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Add logo to bottom-left corner
            pdf.addImage(
              logo,
              'PNG',
              margin,
              pageHeight - logoHeight - margin + 10,
              logoWidth,
              logoHeight
            );

            // Add description text next to the logo
            pdf.setFontSize(10);
            pdf.text(description, margin + logoWidth + 5, pageHeight - margin);

            // Add link in bottom-right corner
            pdf.setFontSize(10);
            pdf.textWithLink(
              'View Map',
              pageWidth - margin - 40,
              pageHeight - margin,
              { url: redirectUrl }
            );

            // Save the PDF
            pdf.save(e.print.legend ? 'legend.pdf' : 'map.pdf');
          };
        } else {
          // Handle the canvas export for non-PDF case
          const margin = 10;
          const date = new Date().toLocaleDateString();
          const logoUrl = 'assets/img/logo-gis.png';
          const description = 'Map description text here lorem ipsum';
          const redirectText = 'View Map';

          // Create a new canvas with extra space for margin
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Set canvas dimensions larger to include margin
            canvas.width = e.canvas.width + 2 * margin;
            canvas.height = e.canvas.height + 2 * margin;

            // Draw the map image onto the new canvas with margin
            ctx.drawImage(e.canvas, margin, margin);

            // Add date in the top-right corner
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(
              `Printed on Date: ${date}`,
              canvas.width - margin - 10,
              margin + 10
            );

            // Load the logo image and add it to the bottom-left corner with description
            const logo = new Image();
            logo.src = logoUrl;
            logo.onload = () => {
              const logoWidth = 16;
              const logoHeight = 16;
              const logoX = margin;
              const logoY = canvas.height - logoHeight - margin;

              // Draw the logo in the bottom-left corner
              ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

              // Draw the description text next to the logo
              ctx.font = '12px Arial';
              ctx.textAlign = 'left';
              ctx.fillText(
                description,
                logoX + logoWidth + 5,
                canvas.height - margin - 5
              );

              // Add link text in the bottom-right corner
              ctx.font = '10px Arial';
              ctx.textAlign = 'right';
              ctx.fillText(
                redirectText,
                canvas.width - margin,
                canvas.height - margin
              );

              // Convert the canvas to a Blob and save it as an image
              canvas.toBlob(
                (blob: any) => {
                  const name = 'map_with_elements';
                  saveAs(blob, name);
                },
                e.imageType,
                e.quality
              );
            };
          }
        }
      } else {
        console.warn('No canvas to export');
      }
    });
  }
}
