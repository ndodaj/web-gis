import { Injectable } from '@angular/core';
import { Draw, Modify } from 'ol/interaction';
import { MapService } from '../map.service';
import { Overlay } from 'ol';
import { BaseService } from '@core/api/base-service';
import { AppConfigService } from '@core/services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class SaveWFSService extends BaseService {
  draw!: Draw;
  modify!: Modify;
  selectSingleClick!: any;
  featureID!: any;
  source!: any;
  vectorLayer!: any;
  layerParam2!: any;
  workspace!: any;
  layerName!: any;
  // popup = new Overlay({
  //   element: document.getElementById('popup')!,
  //   positioning: 'bottom-center',
  // });

  constructor(private mapService: MapService, config: AppConfigService) {
    //this.mapService.getMap().addOverlay(this.popup);
    super(config);
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
        console.log('Transaction Response:', data);
        window.location.reload();
        // You can show a success message or handle errors here
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  saveForm() {
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
}
