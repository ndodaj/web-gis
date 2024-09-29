import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from '@core/models/app-routes';
import { HistoryManagementComponent } from './containers/history/history-management.component';

const routes: AppRoutes = [
  { path: '', redirectTo: 'history', pathMatch: 'full' },
  {
    path: 'history',
    component: HistoryManagementComponent,
    data: {
      breadcrumb: 'List',
      pageTitle: 'History',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryManagementRoutingModule {}
