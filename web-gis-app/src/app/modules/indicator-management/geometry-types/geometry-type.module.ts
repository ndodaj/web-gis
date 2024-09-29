import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { GeometryTypesComponent } from './containers/geometry-types/geometry-types.component';
import { GeometryTypeRoutingModule } from './geometry-type-routing.module';

@NgModule({
  declarations: [GeometryTypesComponent],
  imports: [CommonModule, GeometryTypeRoutingModule, SharedModule],
})
export class GeometryTypeModule {}
