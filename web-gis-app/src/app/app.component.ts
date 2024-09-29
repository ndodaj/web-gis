import { Component, Inject, Renderer2 } from '@angular/core';
import {
  AppConfigName,
  ColorVariable,
  ThemeConfigService,
  colorVariables
} from './core/services/theme-config.service';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  MatIconRegistry,
  SafeResourceUrlWithIconOptions
} from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ColorSchemeName } from './core/models/color-scheme-name';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { SplashScreenService } from './core/services/splach-screen.service';
import { MENU_ITEMS } from './menu-items';
import { NavigationService } from '@core/services/navigation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private themeConfigService: ThemeConfigService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private splashScreenService: SplashScreenService,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private navigationService: NavigationService,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    this.splashScreenService.initialize();

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    this.matIconRegistry.addSvgIconResolver(
      (
        name: string,
        namespace: string
      ): SafeResourceUrl | SafeResourceUrlWithIconOptions | null => {
        if (namespace === 'mat') {
          return this.domSanitizer.bypassSecurityTrustResourceUrl(
            `assets/img/icons/material-design-icons/two-tone/${name}.svg`
          );
        }
        return null;
      }
    );

    this.route.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('layout')) {
        this.themeConfigService.setConfig(
          queryParamMap.get('layout') as AppConfigName
        );
      }

      if (queryParamMap.has('style')) {
        this.themeConfigService.updateConfig({
          style: {
            colorScheme: queryParamMap.get('style') as ColorSchemeName
          }
        });
      }

      if (queryParamMap.has('primaryColor')) {
        const color: ColorVariable =
          colorVariables[queryParamMap.get('primaryColor') as string];

        if (color) {
          this.themeConfigService.updateConfig({
            style: {
              colors: {
                primary: color
              }
            }
          });
        }
      }

      if (queryParamMap.has('rtl')) {
        this.themeConfigService.updateConfig({
          direction: coerceBooleanProperty(queryParamMap.get('rtl'))
            ? 'rtl'
            : 'ltr'
        });
      }
    });
    this.navigationService.items = MENU_ITEMS;
  }
}
