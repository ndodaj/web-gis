import { AppConfigName } from '../services/theme-config.service';
import { ColorSchemeName } from './color-scheme-name';
import { CSSValue } from './css-value';

export interface ThemeConfig {
  id: AppConfigName;
  name: string;
  direction: 'ltr' | 'rtl';
  style: {
    colorScheme: ColorSchemeName;
    colors: {
      primary: {
        default: string;
        contrast: string;
      };
    };
    borderRadius: CSSValue;
    button: {
      borderRadius: CSSValue | undefined;
    };
  };
  layout: 'vertical' | 'horizontal';
  boxed: boolean;
  sidenav: {
    title: string;
    imageUrl: string;
    showCollapsePin: boolean;
    user: {
      visible: boolean;
    };
    state: 'expanded' | 'collapsed';
  };
  toolbar: {
    fixed: boolean;
    user: {
      visible: boolean;
    };
  };
  navbar: {
    position: 'below-toolbar' | 'in-toolbar';
  };
  footer: {
    visible: boolean;
    fixed: boolean;
  };
}
