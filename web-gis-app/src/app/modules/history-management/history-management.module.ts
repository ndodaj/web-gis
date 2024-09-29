import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryManagementRoutingModule } from './history-management-routing.module';
import { SharedModule } from '@shared/shared.module';
import { HistoryManagementComponent } from './containers/history/history-management.component';

@NgModule({
  declarations: [HistoryManagementComponent],
  imports: [CommonModule, HistoryManagementRoutingModule, SharedModule],
})
export class HistoryManagementModule {}
