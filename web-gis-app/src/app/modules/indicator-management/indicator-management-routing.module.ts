import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { AppRoutes } from '@core/models/app-routes';

const routes: AppRoutes = [
  {
    path: 'indicator-categories',
    loadChildren: () =>
      import('./indicator-category/indicator-category.module').then(
        (m) => m.IndicatorCategoryModule
      ),

    data: {
      breadcrumb: 'Categories',
      anyPermission: AppPermissionsEnum.indicatorcategory_get_permission,
    },
  },
  {
    path: 'indicators',
    loadChildren: () =>
      import('./indicators/indicator.module').then((m) => m.IndicatorModule),

    data: {
      breadcrumb: 'Indicators',
      anyPermission: AppPermissionsEnum.indicator_get_permission,
    },
  },
  {
    path: 'attributes',
    loadChildren: () =>
      import('./attributes/attribute.module').then((m) => m.AttributeModule),

    data: {
      breadcrumb: 'Attributes',
      anyPermission: AppPermissionsEnum.attributes_get_permission,
    },
  },
  {
    path: 'geometry-types',
    loadChildren: () =>
      import('./geometry-types/geometry-type.module').then(
        (m) => m.GeometryTypeModule
      ),

    data: {
      breadcrumb: 'Geometry Types',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatormanagementRoutingModule {}
