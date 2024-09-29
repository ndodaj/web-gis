import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@core/models/app-routes';
import { ProfileComponent } from './containers/account-detail/account-detail.component';
import { AccountDetailResolver } from './resolvers/account-detail.resolver';

const routes: AppRoutes = [
  { path: '', redirectTo: 'detail', pathMatch: 'full' },
  {
    path: 'detail',
    component: ProfileComponent,
    data: {
      pageTitle: 'User Details',
      breadcrumb: 'Details'
    },
    resolve: { accountDetail: AccountDetailResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
