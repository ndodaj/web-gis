import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from '@core/models/app-routes';
import { SearchUsersComponent } from './containers/users/users.component';

const routes: AppRoutes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users',
    component: SearchUsersComponent,
    data: {
      breadcrumb: 'List',
      pageTitle: 'Users',
      //anyPermission: AppPermissionsEnum.can_this_form_post,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
