import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { SharedModule } from '@shared/shared.module';
import { DocumentComponent } from './containers/history/document.component';
import { UploadFileComponent } from './components/upload-file.component';

@NgModule({
  declarations: [DocumentComponent, UploadFileComponent],
  imports: [CommonModule, DocumentsRoutingModule, SharedModule],
})
export class DocumentsModule {}
