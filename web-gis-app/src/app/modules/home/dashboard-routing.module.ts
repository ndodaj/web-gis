import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from '@core/models/app-routes';
import { DashboardComponent } from './containers/users/dashboard.component';
import { AccountDetailResolver } from '../profile/resolvers/account-detail.resolver';

const routes: AppRoutes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      breadcrumb: 'Home',
      pageTitle: 'Dashboard',
      resolve: { accountDetail: AccountDetailResolver },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
