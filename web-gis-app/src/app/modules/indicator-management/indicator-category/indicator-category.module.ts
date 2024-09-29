import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { IndicatorCategoryRoutingModule } from './indicator-category-routing.module';
import { IndicatorCategoryComponent } from './containers/indicator-categories/indicator-category.component';
import { CreateEditIndicatorCategoryComponent } from './components/create-edit-indicator-category/create-edit-indicator-category.component';

@NgModule({
  declarations: [
    IndicatorCategoryComponent,
    CreateEditIndicatorCategoryComponent,
  ],
  imports: [CommonModule, IndicatorCategoryRoutingModule, SharedModule],
})
export class IndicatorCategoryModule {}
