import { Component, Inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-coordinate-info-dialog',
  template: `
    <div
      class="overflow-auto max-w-64 p-2 border border-gray-300 rounded bg-white shadow-md"
    >
      <div class="grid grid-cols-2 gap-2">
        <div class="border-b py-1 text-sm">Latitude (DMS)</div>
        <div class="border-b py-1 text-sm">{{ data.latitudeDMS }}</div>
        <div class="border-b py-1 text-sm">Longitude (DMS)</div>
        <div class="border-b py-1 text-sm">{{ data.longitudeDMS }}</div>
        <div class="border-b py-1 text-sm">UTM (EPSG:32634)</div>
        <div class="border-b py-1 text-sm break-words">
          {{ data.transformedCoordinate }}
        </div>
      </div>
    </div>
  `,
})
export class CoordinateInfoDialogComponent {
  data: any;

  constructor(
    public ref: DynamicDialogRef,
    @Inject(DynamicDialogConfig) public config: any
  ) {
    this.data = config.data;
  }
}
