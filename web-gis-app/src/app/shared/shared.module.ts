import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';

import { BooleanPipe } from './pipes/boolean.pipe';
import { HighlightDirective } from './directives/highlight/highlight.directive';
import {
  HIGHLIGHT_OPTIONS,
  HighlightOptions,
} from './directives/highlight/highlight.model';
import { HighlightService } from './directives/highlight/highlight.service';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import { UpperCaseInputDirective } from './directives/upper-case-input/upper-case-input.directive';
import { TogglePasswordVisibilityDirective } from './directives/toggle-password-visibility/toggle-password-visibility.directive';

import { MatTreeModule } from '@angular/material/tree';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PopoverComponent } from './components/popover/popover.component';
import { TimespanFormatterPipe } from './pipes/timespan-formatter.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { HasAnyPermissionDirective } from './directives/has-any-permission/has-any-permission.directive';
import { PasswordButtonComponent } from './directives/toggle-password-visibility/password-button.component';
import { EllipsisTooltipDirective } from './directives/ellipsis-tooltip-directive/ellipsis-tooltip-directive';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesDialogComponent } from './services/coordinates/components/properties.components';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableComponent } from './components/table.component';
import { PropertiesFormDialogComponent } from './services/get-info/components/properties.components';
const modules = [
  CommonModule,
  TranslateModule,
  FormsModule,
  MatTreeModule,
  ReactiveFormsModule,
  RouterModule,
  NgxMatSelectSearchModule,
];
const components = [
  BooleanPipe,
  HighlightDirective,
  EllipsisTooltipDirective,
  UpperCaseInputDirective,
  TogglePasswordVisibilityDirective,
  PopoverComponent,
  TableComponent,
  TimespanFormatterPipe,
  JoinPipe,
  HasAnyPermissionDirective,
];

export function hljsLanguages() {
  return [
    { name: 'typescript', func: typescript },
    { name: 'scss', func: scss },
    { name: 'xml', func: xml },
  ];
}

@NgModule({
  declarations: [...components, PasswordButtonComponent],
  imports: [...modules, MaterialModule, DialogModule, OverlayPanelModule],
  exports: [...modules, MaterialModule, ...components, OverlayPanelModule],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        minWidth: '55vw',
        enterAnimationDuration: 100,
        exitAnimationDuration: 100,
        closeOnNavigation: true,
      },
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: hljsLanguages,
      } as HighlightOptions,
    },
    HighlightService,
    DialogService,
    PropertiesDialogComponent,
    PropertiesFormDialogComponent,
    OverlayPanel,
  ],
})
export class SharedModule {}
