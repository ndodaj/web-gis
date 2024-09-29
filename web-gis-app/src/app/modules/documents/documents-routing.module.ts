import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from '@core/models/app-routes';
import { DocumentComponent } from './containers/history/document.component';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';

const routes: AppRoutes = [
  { path: '', redirectTo: 'documents', pathMatch: 'full' },
  {
    path: 'documents',
    component: DocumentComponent,
    data: {
      breadcrumb: 'List',
      pageTitle: 'Documents',
      anyPermission: AppPermissionsEnum.document_get_permission,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRoutingModule {}
