export interface BreadcrumbItem {
  id: string;
  label: string;
  routerLink?: string;
  queryParams?: {
    [k: string]: any;
  };
}
