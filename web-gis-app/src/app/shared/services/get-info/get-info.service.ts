import { Injectable } from '@angular/core';
import { Draw, Modify } from 'ol/interaction';
import { MapService } from '../map.service';
import { Overlay } from 'ol';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { PropertiesFormDialogComponent } from './components/properties.components';
import { AppConfigService } from '@core/services/app-config.service';
import { BaseService } from '@core/api/base-service';

@Injectable({
  providedIn: 'root',
})
export class GetInfoService extends BaseService {
  ref: DialogRef | undefined;
  draw!: Draw;
  modify!: Modify;
  selectSingleClick!: any;
  featureID!: any;
  source!: any;
  vectorLayer!: any;
  layerParam2!: any;
  workspace!: any;
  layerName!: any;
  popup = new Overlay({
    element: document.getElementById('popup')!,
    positioning: 'bottom-center',
  });

  constructor(
    private mapService: MapService,
    private snackBarService: MatSnackBar,
    public dialog: MatDialog,
    config: AppConfigService
  ) {
    super(config);
  }

  getFeatureInfo() {
    this.mapService.getMap().on('singleclick', this.singleClick);
  }
  singleClick = (event?: any) => {
    console.log('this.singleClick');

    const tolerance = 5;
    //const coordinate = event.coordinate;

    const pixel = event.pixel;

    let featureFound = false;
    this.mapService.getMap().forEachFeatureAtPixel(
      pixel,
      (feature, layer) => {
        if (feature) {
          this.featureID = feature.getId();

          this.source = layer.getSource();

          //const features = this.source.getFeatures();
          const url = this.source.getUrl();

          this.vectorLayer = layer;

          // Extract workspace and layer name from the URL
          const urlParts = new URL(url);

          this.layerParam2 = urlParts.searchParams.get('typeName'); // Get the typeName parameter from the URL

          [this.workspace, this.layerName] = this.layerParam2.split(':');

          featureFound = true;
          const properties = feature.getProperties();

          this.updatePopupContent(properties, layer);
        }
      },
      {
        hitTolerance: tolerance,
      }
    );
    if (!featureFound) {
      document.getElementById('popup')?.classList.remove('showPop');
      this.popup.setPosition(undefined);
    }
  };
  updatePopupContent(properties: any, layer: any) {
    const data = {
      properties: properties,
      layerparam: this.layerParam2,
      featureId: this.featureID,
      layer: layer,
    };
    this.dialog.open(PropertiesFormDialogComponent, { data: data });
  }
  getPopUp() {
    this.popup;
  }

  saveFormBtn() {
    const saveForm = document.getElementById('saveForm')!;
    saveForm.addEventListener('click', (e) => {
      // Prevent the default form submission behavior
      e.preventDefault();

      // Get all input fields within the form
      const inputFields = document.querySelectorAll(
        "#popup input[type='text']"
      );

      // Create an empty object to store the updated properties
      const updatedProperties: any = {};

      // Loop through each input field and add its value to the updatedProperties object
      inputFields.forEach((inputField: any) => {
        // Get the field name (without the "input-" prefix)
        const fieldName: any = inputField.id.replace('input-', '')!;

        // Add the field name and its value to the updatedProperties object
        updatedProperties[fieldName] = inputField.value;
      });

      // Call the saveChanges function to save the changes to the database
      this.saveChanges(updatedProperties);
    });
  }

  saveChanges(properties: any) {
    // Prepare the transaction request XML
    var transactionXML = `<wfs:Transaction service="WFS" version="1.0.0"
    xmlns:topp="http://www.openplans.org/topp"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:wfs="http://www.opengis.net/wfs">
      <wfs:Update typeName="${this.layerParam2}">`;

    // Loop through properties and add them to the transaction XML
    for (const [key, value] of Object.entries(properties)) {
      // Skip updating the "id" property
      if (key === 'id') {
        continue;
      }
      transactionXML += `<wfs:Property>
          <wfs:Name>${key}</wfs:Name>
          <wfs:Value>${value}</wfs:Value>
        </wfs:Property>`;
    }

    transactionXML += `<ogc:Filter>
        <ogc:FeatureId fid="${this.featureID}"/>
      </ogc:Filter>
        </wfs:Update>
      </wfs:Transaction>`;

    // Send the transaction request to the WFS server
    fetch(`${this.geoserverUrl}/geoserver/test/ows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
      },
      body: transactionXML,
    })
      .then((response) => response.text())
      .then((data) => {
        // Handle the response from the server
        this.closeModal();
        console.log('Transaction Response:', data);
        // You can show a success message or handle errors here
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  closeModal() {
    const selectedLayer = this.mapService.layerSwitcher.getSelection();

    const source = selectedLayer?.getSource();

    this.mapService.getMap().un('singleclick', this.singleClick);
    source.refresh();
    const coordsModal = document.getElementById('popup')!;
    coordsModal.classList.remove('showPop');
    this.snackBarService.open('Attributes Updated Successfully!');
  }
}
