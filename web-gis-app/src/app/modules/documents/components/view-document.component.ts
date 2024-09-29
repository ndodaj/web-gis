import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutoUnsubscribe } from '@core/utils';
import { DomSanitizer } from '@angular/platform-browser';

@AutoUnsubscribe
@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
})
export class ViewDocumentComponent {
  fileName: any;
  preview: any = undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public sanitizer: DomSanitizer
  ) {
    this.fileName = this.dialogData?.name;

    this.preview = this.sanitizer.bypassSecurityTrustResourceUrl(
      `http://195.201.1.79:5000/static/uploads/${this.fileName}`
    );
  }
}
