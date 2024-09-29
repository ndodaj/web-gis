import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@core/models/app-routes';
import { IndicatorComponent } from './containers/indicators/indicator.component';

const routes: AppRoutes = [
  {
    path: '',
    component: IndicatorComponent,
    data: {
      pageTitle: 'Indicators',
      breadcrumb: 'List',
    },
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatormanagementRoutingModule {}
