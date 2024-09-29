import { NavigationLink } from './navigation-link';

export interface NavigationDropdown {
  type: 'dropdown';
  label: string;
  icon?: string;
  children: Array<NavigationLink | NavigationDropdown>;
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };
  anyPermission?: string[];
}
