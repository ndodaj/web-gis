import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { IndicatormanagementRoutingModule } from './indicator-routing.module';
import { IndicatorComponent } from './containers/indicators/indicator.component';
import { CreateEditIndicatorComponent } from './components/create-edit-indicator/create-edit-indicator.component';

@NgModule({
  declarations: [IndicatorComponent, CreateEditIndicatorComponent],
  imports: [CommonModule, IndicatormanagementRoutingModule, SharedModule],
})
export class IndicatorModule {}
