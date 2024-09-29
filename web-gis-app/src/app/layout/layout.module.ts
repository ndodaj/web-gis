import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { SharedModule } from '@shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavigationItemComponent } from './navigation-item/navigation-item.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ContentLayoutComponent } from './content-layout/content-layout.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { ScrollbarComponent } from './scrollbar/scrollbar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SecondaryToolbarComponent } from './secondary-toolbar/secondary-toolbar.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { UserToolbarMenuComponent } from './user-toolbar-menu/user-toolbar-menu.component';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import {
  LOADING_BAR_CONFIG,
  LoadingBarConfig,
  LoadingBarModule
} from '@ngx-loading-bar/core';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
@NgModule({
  declarations: [
    ContentLayoutComponent,
    SidenavComponent,
    ScrollbarComponent,
    SidenavItemComponent,
    NavigationComponent,
    FooterComponent,
    ToolbarComponent,
    NavigationItemComponent,
    FullLayoutComponent,
    BreadcrumbComponent,
    SecondaryToolbarComponent,
    UserMenuComponent,
    UserToolbarMenuComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule
  ],
  exports: [FullLayoutComponent],
  providers: [
    {
      provide: LOADING_BAR_CONFIG,
      useValue: {
        latencyThreshold: 80
      } as LoadingBarConfig
    }
  ]
})
export class LayoutModule {}
