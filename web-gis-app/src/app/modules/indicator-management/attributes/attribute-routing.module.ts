import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@core/models/app-routes';
import { AttributesComponent } from './containers/attributes/attributes.component';
import { CreateEditAttributeComponent } from './components/create-edit-attribute/create-edit-attribute.component';

const routes: AppRoutes = [
  {
    path: '',
    component: AttributesComponent,
    data: {
      pageTitle: 'Attributes',
      breadcrumb: 'List',
    },
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: 'create-attribute',

    component: CreateEditAttributeComponent,
    data: {
      breadcrumb: 'Add',
    },
  },
  {
    path: 'edit-attribute/:id',
    component: CreateEditAttributeComponent,

    data: {
      breadcrumb: 'Edit',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttributeRoutingModule {}
