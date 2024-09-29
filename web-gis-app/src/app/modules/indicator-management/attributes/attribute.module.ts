import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AttributeRoutingModule } from './attribute-routing.module';
import { AttributesComponent } from './containers/attributes/attributes.component';
import { CreateEditAttributeComponent } from './components/create-edit-attribute/create-edit-attribute.component';

@NgModule({
  declarations: [AttributesComponent, CreateEditAttributeComponent],
  imports: [CommonModule, AttributeRoutingModule, SharedModule],
})
export class AttributeModule {}
