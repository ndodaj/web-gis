import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { AppRoutes } from './core/models/app-routes';
import { AuthGuard, HasAnyPermissionGuard } from '@core/services/auth.service';
import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
const routes: AppRoutes = [
  {
    path: 'map',
    loadChildren: () =>
      import('./modules/gis/map.module').then((m) => m.MapModule),
  },
  {
    path: 'view-documents',
    //canMatch: [HasAnyPermissionGuard],
    loadChildren: () =>
      import('./modules/view-documents/documents.module').then(
        (m) => m.DocumentsModule
      ),
    data: {
      breadcrumb: 'Documents',
      //anyPermission: AppPermissionsEnum.can_this_form_post,
    },
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },

  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        // canMatch: [HasAnyPermissionGuard],
        loadChildren: () =>
          import('./modules/home/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        data: {
          pageTitle: 'Dashboard',
          breadcrumb: 'Welcome to Dashboard',
          //anyPermission: AppPermissionsEnum.can_this_form_post,
        },
      },
      {
        path: 'data-approval',
        canMatch: [HasAnyPermissionGuard],
        loadChildren: () =>
          import('./modules/data-approval/data-approval.module').then(
            (m) => m.DataApprovalModule
          ),
        data: {
          pageTitle: 'Approvals',
          breadcrumb: 'Data Approvals',
          anyPermission: AppPermissionsEnum.dataapproval_get_all_permission,
        },
      },
      {
        path: 'indicator-management',
        canMatch: [HasAnyPermissionGuard],
        loadChildren: () =>
          import(
            './modules/indicator-management/indicator-management.module'
          ).then((m) => m.IndicatorManagementModule),
        data: {
          pageTitle: 'Indicator',
          breadcrumb: 'Indicator Management',
          anyPermission: AppPermissionsEnum.indicatorcategory_get_permission,
        },
      },
      {
        path: 'indicators',
        canMatch: [HasAnyPermissionGuard],
        loadChildren: () =>
          import(
            './modules/indicator-management/indicator-management.module'
          ).then((m) => m.IndicatorManagementModule),
        data: {
          pageTitle: 'Indicator',
          breadcrumb: 'Indicators',
          anyPermission: AppPermissionsEnum.indicator_get_permission,
        },
      },
      {
        path: 'raports',
        //canMatch: [HasAnyPermissionGuard],
        loadComponent: () =>
          import('./modules/reports/users/raports.component').then(
            (m) => m.RaportsComponent
          ),
        data: {
          pageTitle: 'Indicator Raport',
          breadcrumb: 'Raports',
          // anyPermission: AppPermissionsEnum.
        },
      },
      {
        path: 'user-management',
        canMatch: [HasAnyPermissionGuard],
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
        data: {
          breadcrumb: 'System Users',
          anyPermission: AppPermissionsEnum.user_get_permission,
        },
      },
      {
        path: 'history-management',
        canMatch: [HasAnyPermissionGuard],
        loadChildren: () =>
          import('./modules/history-management/history-management.module').then(
            (m) => m.HistoryManagementModule
          ),
        data: {
          breadcrumb: 'History',
          anyPermission: AppPermissionsEnum.dataapproval_get_all_permission,
        },
      },
      {
        path: 'documents',
        canMatch: [HasAnyPermissionGuard],
        loadChildren: () =>
          import('./modules/documents/documents.module').then(
            (m) => m.DocumentsModule
          ),
        data: {
          breadcrumb: 'Documents',
          anyPermission: AppPermissionsEnum.document_get_permission,
        },
      },

      {
        path: 'user-profile',
        //canMatch: [HasAnyPermissionGuard],
        loadChildren: () =>
          import('./modules/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
        data: {
          breadcrumb: 'Profile',
        },
      },
    ],
  },
  // {
  //   path: 'login',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('./modules/auth/auth.module').then((m) => m.AuthModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
