import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@core/models/app-routes';
import { IndicatorCategoryComponent } from './containers/indicator-categories/indicator-category.component';

const routes: AppRoutes = [
  {
    path: '',
    component: IndicatorCategoryComponent,
    data: {
      pageTitle: 'Layer Groups',
      breadcrumb: 'List',
    },
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorCategoryRoutingModule {}
