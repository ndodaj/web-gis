import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from '@core/models/app-routes';
import { DataApprovalComponent } from './containers/data-approval/data-approval.component';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';

const routes: AppRoutes = [
  { path: '', redirectTo: 'approvals', pathMatch: 'full' },
  {
    path: 'approvals',
    component: DataApprovalComponent,
    data: {
      breadcrumb: 'List',
      pageTitle: 'Approvals',
      anyPermission: AppPermissionsEnum.dataapproval_get_all_permission,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataApprovalRoutingModule {}
