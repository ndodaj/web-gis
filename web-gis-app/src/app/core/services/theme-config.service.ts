import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { DeepPartial } from '../models/deep-partial';
import { mergeDeep } from '../utils/merge-deep';
import { LayoutService } from './layout.service';
import { ColorSchemeName } from '../models/color-scheme-name';
import { CSSValue } from '../models/css-value';
import { ThemeConfig } from '../models/theme-config';
import { map } from 'rxjs/operators';

export enum AppConfigName {
  APOLEX = 'app-layout-apolex',
  ZEOAK = 'app-layout-zeoak',
  PATHERME = 'app-layout-patherme',
  ZIGPOSE = 'app-layout-zigpose',
  MOLAREAS = 'app-layout-molareas',
  ZANIKAR = 'app-layout-zenikar',
}

export interface ColorVariable {
  light: string;
  default: string;
  contrast: string;
}

export const colorVariables: Record<string, ColorVariable> = {
  blue: {
    light: 'rgba(99, 102, 241, .1)',
    default: 'rgb(99, 102, 241)',
    contrast: 'rgb(255, 255, 255)',
  },
  gray: {
    light: 'rgba(158, 158, 158, 0.1)',
    default: 'rgb(158, 158, 158)',
    contrast: 'rgb(255, 255, 255)',
  },
  red: {
    light: 'rgba(244, 67, 54, 0.1)',
    default: 'rgb(244, 67, 54)',
    contrast: 'rgb(255, 255, 255)',
  },
  orange: {
    light: 'rgba(255, 152, 0, 0.1)',
    default: 'rgb(255, 152, 0)',
    contrast: 'rgb(0, 0, 0)',
  },
  'deep-orange': {
    light: 'rgba(255, 87, 34, 0.1)',
    default: 'rgb(255, 87, 34)',
    contrast: 'rgb(255, 255, 255)',
  },
  amber: {
    light: 'rgba(255, 193, 7, 0.1)',
    default: 'rgb(255, 193, 7)',
    contrast: 'rgb(0, 0, 0)',
  },
  green: {
    light: 'rgba(76, 175, 80, 0.1)',
    default: 'rgb(76, 175, 80)',
    contrast: 'rgb(255, 255, 255)',
  },
  teal: {
    light: 'rgba(0, 150, 136, 0.1)',
    default: 'rgb(0, 150, 136)',
    contrast: 'rgb(255, 255, 255)',
  },
  cyan: {
    light: 'rgba(0, 188, 212, 0.1)',
    default: 'rgb(0, 188, 212)',
    contrast: 'rgb(255, 255, 255)',
  },
  purple: {
    light: 'rgba(156, 39, 176, 0.1)',
    default: 'rgb(156, 39, 176)',
    contrast: 'rgb(255, 255, 255)',
  },
  'deep-purple': {
    light: 'rgba(103, 58, 183, 0.1)',
    default: 'rgb(103, 58, 183)',
    contrast: 'rgb(255, 255, 255)',
  },
  pink: {
    light: 'rgba(233, 30, 99, 0.1)',
    default: 'rgb(233, 30, 99)',
    contrast: 'rgb(255, 255, 255)',
  },
};

const defaultConfig: ThemeConfig = {
  id: AppConfigName.APOLEX,
  name: 'Apolex',
  style: {
    colorScheme: ColorSchemeName.default,
    colors: {
      primary: colorVariables.blue,
    },
    borderRadius: {
      value: 0.25,
      unit: 'rem',
    },
    button: {
      borderRadius: undefined,
    },
  },
  direction: 'ltr',
  layout: 'horizontal',
  boxed: false,
  sidenav: {
    title: 'Build Green Group Albania',
    imageUrl: 'assets/img/logo.svg',
    showCollapsePin: true,
    user: {
      visible: true,
    },
    state: 'expanded',
  },
  toolbar: {
    fixed: true,
    user: {
      visible: true,
    },
  },
  navbar: {
    position: 'below-toolbar',
  },
  footer: {
    visible: true,
    fixed: true,
  },
};

const configs: ThemeConfig[] = [
  defaultConfig,
  mergeDeep(
    { ...defaultConfig },
    {
      id: AppConfigName.ZIGPOSE,
      name: 'Zigpose',
      style: {
        borderRadius: {
          value: 0.5,
          unit: 'rem',
        },
        button: {
          borderRadius: {
            value: 9999,
            unit: 'px',
          },
        },
      },
      sidenav: {
        user: {
          visible: true,
        },
      },
      footer: {
        fixed: false,
      },
    }
  ),
  mergeDeep(
    { ...defaultConfig },
    {
      id: AppConfigName.PATHERME,
      name: 'Patherme',
      layout: 'vertical',
      boxed: true,
      sidenav: {
        user: {
          visible: false,
        },
      },
      toolbar: {
        fixed: false,
      },
      footer: {
        fixed: false,
      },
    }
  ),
  mergeDeep(
    { ...defaultConfig },
    {
      id: AppConfigName.MOLAREAS,
      name: 'Molareas',
      sidenav: {
        user: {
          visible: false,
        },
      },
      toolbar: {
        fixed: false,
      },
      navbar: {
        position: 'in-toolbar',
      },
      footer: {
        fixed: false,
      },
    }
  ),
  mergeDeep(
    { ...defaultConfig },
    {
      id: AppConfigName.ZEOAK,
      name: 'Zeoak',
      sidenav: {
        state: 'collapsed',
      },
    }
  ),
  mergeDeep(
    { ...defaultConfig },
    {
      id: AppConfigName.ZANIKAR,
      name: 'Ikaros',
      layout: 'vertical',
      boxed: true,
      sidenav: {
        user: {
          visible: false,
        },
      },
      toolbar: {
        fixed: false,
      },
      navbar: {
        position: 'in-toolbar',
      },
      footer: {
        fixed: false,
      },
    }
  ),
];

@Injectable({
  providedIn: 'root',
})
export class ThemeConfigService {
  defaultConfig: AppConfigName = AppConfigName.APOLEX;
  configs: ThemeConfig[] = configs;
  private _configSubject = new BehaviorSubject(
    this.configs.find((c) => c.id === this.defaultConfig) as ThemeConfig
  );
  config$ = this._configSubject.asObservable();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private layoutService: LayoutService
  ) {
    this.config$.subscribe((config) => this._updateConfig(config));
  }

  select<R>(selector: (config: ThemeConfig) => R): Observable<R> {
    return this.config$.pipe(map(selector));
  }

  setConfig(config: AppConfigName) {
    const settings = this.configs.find((c) => c.id === config) as ThemeConfig;
    this._configSubject.next(settings);
  }

  updateConfig(config: DeepPartial<ThemeConfig>) {
    this._configSubject.next(
      mergeDeep({ ...this._configSubject.getValue() }, config)
    );
  }

  private _updateConfig(config: ThemeConfig): void {
    this._setLayoutClass(config.id);
    this._setStyle(config.style);
    this._setDirection(config.direction);
    this._setSidenavState(config.sidenav.state);
    this._emitResize();
  }

  private _setStyle(style: ThemeConfig['style']): void {
    /**
     * Color Scheme
     */
    Object.values(ColorSchemeName)
      .filter((s) => s !== style.colorScheme)
      .forEach((value) => {
        if (this.document.body.classList.contains(value)) {
          this.document.body.classList.remove(value);
        }
      });

    this.document.body.classList.add(style.colorScheme);

    /**
     * Border Radius
     */
    this.document.body.style.setProperty(
      '--border-radius',
      `${style.borderRadius.value}${style.borderRadius.unit}`
    );
    const buttonBorderRadius: CSSValue =
      style.button.borderRadius ?? style.borderRadius;
    this.document.body.style.setProperty(
      '--button-border-radius',
      `${buttonBorderRadius.value}${buttonBorderRadius.unit}`
    );

    /**
     * Primary Color
     */
    this.document.body.style.setProperty(
      '--color-primary',
      style.colors.primary.default.replace('rgb(', '').replace(')', '')
    );
    this.document.body.style.setProperty(
      '--color-primary-rgb',
      style.colors.primary.default
    );
    this.document.body.style.setProperty(
      '--color-primary-contrast',
      style.colors.primary.contrast.replace('rgb(', '').replace(')', '')
    );
    this.document.body.style.setProperty(
      '--color-primary-contrast-rgb',
      style.colors.primary.contrast
    );
  }

  /**
   * Emit event so charts and other external libraries know they have to resize on layout switch
   * @private
   */
  private _emitResize(): void {
    if (window) {
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
    }
  }

  private _setDirection(direction: 'ltr' | 'rtl') {
    this.document.body.dir = direction;
  }

  private _setSidenavState(sidenavState: 'expanded' | 'collapsed'): void {
    sidenavState === 'expanded'
      ? this.layoutService.expandSidenav()
      : this.layoutService.collapseSidenav();
  }

  private _setLayoutClass(layout: AppConfigName): void {
    this.configs.forEach((c) => {
      if (this.document.body.classList.contains(c.id)) {
        this.document.body.classList.remove(c.id);
      }
    });

    this.document.body.classList.add(layout);
  }
}
