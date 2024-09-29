import { NavigationDropdown } from './navigation-dropdown';
import { NavigationLink } from './navigation-link';
import { NavigationSubheading } from './navigation-subheading';

export type NavigationItem =
  | NavigationLink
  | NavigationDropdown
  | NavigationSubheading;
