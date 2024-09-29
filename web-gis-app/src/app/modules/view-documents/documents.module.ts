import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { SharedModule } from '@shared/shared.module';
import { DocumentComponent } from './containers/history/document.component';

@NgModule({
  declarations: [DocumentComponent],
  imports: [CommonModule, DocumentsRoutingModule, SharedModule],
})
export class DocumentsModule {}
