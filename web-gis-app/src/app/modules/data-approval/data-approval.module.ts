import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataApprovalRoutingModule } from './data-approval-routing.module';
import { SharedModule } from '@shared/shared.module';
import { DataApprovalComponent } from './containers/data-approval/data-approval.component';

@NgModule({
  declarations: [DataApprovalComponent],
  imports: [CommonModule, DataApprovalRoutingModule, SharedModule],
})
export class DataApprovalModule {}
