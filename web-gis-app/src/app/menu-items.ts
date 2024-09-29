import { AppPermissionsEnum } from '@core/models/app-permissions-enum';
import { NavigationItem } from '@core/models/navigation-item';

export const MENU_ITEMS: NavigationItem[] = [
  {
    type: 'dropdown',
    label: 'Data Approval',
    icon: 'mat:checklist',
    children: [
      {
        type: 'link',
        label: 'New Data Approval',
        anyPermission: AppPermissionsEnum.dataapproval_get_all_permission,
        route: '/data-approval/approvals',
      },
      {
        type: 'link',
        label: 'History',
        anyPermission: AppPermissionsEnum.dataapproval_get_all_permission,
        route: '/history-management/history',
      },
    ],
  },
  {
    type: 'dropdown',
    label: 'Indicator Management',
    icon: 'mat:layers',
    children: [
      {
        type: 'link',
        label: 'Category of Indicators',
        route: '/indicator-management/indicator-categories',
        anyPermission: AppPermissionsEnum.indicatorcategory_get_permission,
      },
      {
        type: 'link',
        label: 'Indicator',
        route: '/indicator-management/indicators',
        anyPermission: AppPermissionsEnum.indicator_get_permission,
      },
      {
        type: 'link',
        label: 'Attributes',
        route: '/indicator-management/attributes',
        anyPermission: AppPermissionsEnum.attributes_get_permission,
      },
    ],
  },
  {
    type: 'link',
    label: 'Documents Management',
    anyPermission: AppPermissionsEnum.document_get_permission,
    icon: 'mat:folder',
    route: '/documents/documents',
  },
  {
    type: 'link',
    label: 'Raports Management',
    //anyPermission: AppPermissionsEnum.documents_view_permission,
    icon: 'mat:bar_chart',
    route: '/raports',
  },
  {
    type: 'link',
    label: 'User Management',
    anyPermission: AppPermissionsEnum.user_get_permission,
    icon: 'mat:group',
    route: '/user-management/users',
  },
];
