
import { GisMapComponent } from './gis-map/gis-map.component';
import { MapComponent } from './map/containers/map/map.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

export const components: any[] = [
  ToolbarComponent,
  GisMapComponent,
  MapComponent
];

export * from './toolbar/toolbar.component';
export * from './gis-map/gis-map.component';
export * from './map/containers/map/map.component';
