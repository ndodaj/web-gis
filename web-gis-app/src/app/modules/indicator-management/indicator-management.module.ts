import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { IndicatormanagementRoutingModule } from './indicator-management-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, IndicatormanagementRoutingModule, SharedModule],
})
export class IndicatorManagementModule {}
