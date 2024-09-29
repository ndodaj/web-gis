import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import * as fromComponents from './components';

import { MapRoutingModule } from './map.routing';
import { SharedModule } from '@shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ZoomOutComponent } from './components/toolbar/buttons/zoom-out/zoom-out.component';
import { IdentifyComponent } from './components/toolbar/buttons/identify/identify.component';
import { ArrowForwardComponent } from './components/toolbar/buttons/arrow-forward/arrow-forward.component';
import { ArrowBackComponent } from './components/toolbar/buttons/arrow-back/arrow-back.component';
import { ScaleInputComponent } from './components/toolbar/inputs/scale-input/scale-input.component';
import { CoordsComponent } from './components/toolbar/buttons/coords/coords.component';
import { PanComponent } from './components/toolbar/buttons/pan/pan.component';
import { ZoomExtentComponent } from './components/toolbar/buttons/zoom-extent/zoom-extent.component';
import { GridViewComponent } from './components/toolbar/buttons/grid-view/grid-view.component';
import { GetLocationComponent } from './components/toolbar/buttons/get-location/get-location.component';
import { MessurementComponent } from './components/toolbar/buttons/messurement/messurement.component';
import { SelectControlButtonComponent } from './components/toolbar/buttons/select-control-button/select-control-button.component';
import { SearchWrapperComponent } from './components/toolbar/buttons/search-wrapper/search-wrapper.component';
import { PrintContentComponent } from './components/toolbar/buttons/print-content/print-content.component';
import { ZoomInComponent } from './components/toolbar/buttons/zoom-in/zoom-in.component';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { AddDataComponent } from './components/toolbar/buttons/add-data/add-data.component';
import { DeleteWfsComponent } from './components/toolbar/buttons/delete-wfs/delete-wfs.component';
import { ModifyWfsComponent } from './components/toolbar/buttons/modify-wfs/modify-wfs.component';
import { SelectFeatureComponent } from './components/toolbar/buttons/select-feature/select-feature.component';
import { EditLayerComponent } from './components/toolbar/buttons/edit-layer/edit-layer.component';
import { SaveToLayerComponent } from './components/toolbar/buttons/save-to-layer/save-to-layer.component';
import { EditAttributesComponent } from './components/toolbar/buttons/edit-attributes/edit-attributes.component';
import { FormDialogComponent } from './components/toolbar/buttons/edit-attributes/form-dialog.component';
import { LayerTransactionComponent } from './components/toolbar/buttons/layer-transactions/layer-transaction.component';
import { NotificationListComponent } from './components/toolbar/buttons/notification-list/notification-list.component';
import { UploadFileComponent } from './components/toolbar/buttons/notification-list/components/upload-file.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { EditAttributeFormComponent } from './components/toolbar/buttons/edit-attributes/components/edit-attribute-form.component';
import { ViewDocumentComponent } from '../documents/components/view-document.component';
import { DrawBufferComponent } from './components/toolbar/draw-buffer/draw-buffer.component';
import { AddRadiusComponent } from './components/toolbar/draw-buffer/components/add-radius.component';

@NgModule({
  declarations: [
    ...fromComponents.components,
    ZoomInComponent,
    ZoomOutComponent,
    IdentifyComponent,
    ArrowForwardComponent,
    ArrowBackComponent,
    ScaleInputComponent,
    CoordsComponent,
    PanComponent,
    ZoomExtentComponent,
    GridViewComponent,
    GetLocationComponent,
    MessurementComponent,
    SelectControlButtonComponent,
    PrintContentComponent,
    SearchWrapperComponent,
    AddDataComponent,
    DeleteWfsComponent,
    ModifyWfsComponent,
    AddRadiusComponent,
    SelectFeatureComponent,
    EditLayerComponent,
    SaveToLayerComponent,
    DrawBufferComponent,
    EditAttributesComponent,
    FormDialogComponent,
    LayerTransactionComponent,
    NotificationListComponent,
    UploadFileComponent,
    ViewDocumentComponent,
    EditAttributeFormComponent,
  ],
  imports: [
    MapRoutingModule,
    SharedModule,
    MatIconModule,
    CommonModule,
    ColorPickerModule,
    OverlayPanelModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...fromComponents.components],
})
export class MapModule {}
