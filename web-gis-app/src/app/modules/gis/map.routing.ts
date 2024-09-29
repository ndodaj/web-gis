import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from '@core/models/app-routes';
import { MapComponent } from './components/map/containers/map/map.component';

const routes: AppRoutes = [
  {
    path: '',
    component: MapComponent
  },
  { path: '', redirectTo: 'map', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule {}
