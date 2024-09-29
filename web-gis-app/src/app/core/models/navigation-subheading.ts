import { NavigationDropdown } from './navigation-dropdown';
import { NavigationLink } from './navigation-link';

export interface NavigationSubheading {
  type: 'subheading';
  label: string;
  children: Array<NavigationLink | NavigationDropdown>;
  anyPermission?: string[];
}
