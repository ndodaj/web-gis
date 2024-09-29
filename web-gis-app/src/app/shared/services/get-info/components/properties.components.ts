import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { take, tap } from 'rxjs';
import { AppResponseHandlerService } from '@core/services/app-response-handler.service';
import { ImageService } from '@core/api/services/image.service';
import { CalendarModule } from 'primeng/calendar';
import { MapService } from '@shared/services/map.service';
import * as moment from 'moment';
import { AppConfigService } from '@core/services/app-config.service';
import { BaseService } from '@core/api/base-service';
@Component({
  selector: 'app-properties-dialog',
  templateUrl: './properties.component.html',

  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    CalendarModule,
  ],
})
export class PropertiesFormDialogComponent extends BaseService {
  dynamicForm!: FormGroup;
  fileName = '';
  layerNameTitle!: any;
  selectedLayer!: any;
  propertyKey = 'id';
  layerName: any;
  dataId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private mapService: MapService,
    private dialogRef: MatDialogRef<PropertiesFormDialogComponent>,
    private appResponseHandlerService: AppResponseHandlerService,
    private imageService: ImageService,
    config: AppConfigService
  ) {
    super(config);
  }

  ngOnInit() {
    this.selectedLayer = this.dialogData?.layer;
    this.layerNameTitle = this.dialogData?.layer?.get('title')!;
    this.dynamicForm = this.formBuilder.group({});

    // Loop through keys of the dialogData object to dynamically create form controls
    Object.keys(this.dialogData?.properties).forEach((key) => {
      if (key === 'picture') {
        var url = this.dialogData?.properties[key];

        this.fileName = url?.split('images/')[1];
      }
      if (
        key !== 'geometry' &&
        key !== 'id' &&
        key !== 'Id' &&
        key !== 'gid' &&
        key !== 'Gid' &&
        key !== 'geom' &&
        key !== 'Geometry' &&
        key !== 'Geom' &&
        key !== 'accepted'
      ) {
        // Exclude geometry
        //this.dynamicForm.reset();
        this.dynamicForm.addControl(
          key,
          new FormControl(this.dialogData?.properties[key])
        );
      }
    });
  }
  transform(value: string): string {
    // Split the string by underscores and capitalize each word
    return value
      ?.split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  save(): void {
    const formValue = this.dynamicForm.getRawValue();

    // Iterate through form controls
    for (const controlKey in formValue) {
      if (Object.prototype.hasOwnProperty.call(formValue, controlKey)) {
        let controlValue = formValue[controlKey];

        // Check if control value is a Date object
        if (moment.isMoment(controlValue)) {
          // Format the Date object to your desired format
          controlValue = controlValue.toDate();
          // Format the Date object to your desired format
          const formattedDate = this.formatDate(controlValue);
          // Update the form value with the formatted date
          formValue[controlKey] = formattedDate;
        }
      }
    }

    if ('picture' in formValue) {
      const fileName = formValue['picture'];

      var filename = fileName?.split('\\').pop();
      console.log(filename);
      //const url1 = 'localhost:5000';
      // Generate the URL using the filename
      const url = `${this.apiUrl}/static/images/${this.fileName}`;

      // Update the form value with the generated URL
      formValue['picture'] = url;
    }
    // console.log(formValue);

    // Pass the updated form value to the saveChanges method
    this.saveChanges(formValue);
  }

  formatDate(date: Date): string {
    // Use DatePipe to format the date to your desired format
    // Parse the original date string using moment.js
    const originalDate = moment(date);

    // Get the timezone offset in minutes
    const timezoneOffset = originalDate.utcOffset();

    // Adjust the date for the timezone offset
    const adjustedDate = originalDate.add(timezoneOffset, 'minutes');

    // Convert the adjusted date to the desired format
    const convertedDate = adjustedDate.toISOString();
    return convertedDate;
  }
  closeModal() {
    const selectedLayer = this.mapService.layerSwitcher.getSelection();

    const source = selectedLayer?.getSource();

    source.refresh();
    this.dialogRef.close(true);
    this.dynamicForm.reset();
  }
  // private convertToDate(isoString: string): Date {
  //   return new Date(isoString);
  // }

  onFileSelected(event: any) {
    this.fileName = '';
    const indicatorName = this.selectedLayer.get('title');
    console.log(indicatorName, this.dialogData?.properties);
    const propertyId = this.dialogData?.featureId;
    [this.layerName, this.dataId] = propertyId?.split('.');
    //const numberAfterDot = this.extractNumberAfterDot(propertyId);
    console.log(this.layerName, this.dataId);

    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.imageService
        .upload(formData, this.layerName, this.dataId)
        .pipe(
          take(1),
          this.appResponseHandlerService.handleSuccessMessage(() =>
            file
              ? 'Document Updated successfully!'
              : 'Document Uploaded successfully!'
          ),
          tap((result) => {
            if (result) {
              this.fileName = file.name;
            }
          })
        )
        .subscribe();
    }
  }

  saveChanges(properties: any) {
    // Prepare the transaction request XML
    var transactionXML = `<wfs:Transaction service="WFS" version="1.0.0"
    xmlns:topp="http://www.openplans.org/topp"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:wfs="http://www.opengis.net/wfs">
      <wfs:Update typeName="${this.dialogData?.layerparam}">`;

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
        <ogc:FeatureId fid="${this.dialogData?.featureId}"/>
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
}
