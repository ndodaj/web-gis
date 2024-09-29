import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@core/models/app-routes';
import { GeometryTypesComponent } from './containers/geometry-types/geometry-types.component';

const routes: AppRoutes = [
  {
    path: '',
    component: GeometryTypesComponent,
    data: {
      pageTitle: 'Geometry Types',
      breadcrumb: 'List',
    },
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeometryTypeRoutingModule {}
