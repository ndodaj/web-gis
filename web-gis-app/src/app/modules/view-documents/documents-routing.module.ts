import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from '@core/models/app-routes';
import { DocumentComponent } from './containers/history/document.component';

const routes: AppRoutes = [
  { path: '', redirectTo: 'documents', pathMatch: 'full' },
  {
    path: 'view-documents',
    component: DocumentComponent,
    data: {
      breadcrumb: 'List',
      pageTitle: 'Documents',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRoutingModule {}
