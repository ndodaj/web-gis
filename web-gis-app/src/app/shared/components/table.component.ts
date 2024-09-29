import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mat-odata-table',
  templateUrl: './table.component.html',
})
export class TableComponent {
  @ContentChild('toolbarActions') toolbarActions!: TemplateRef<unknown>;
  @ContentChild('selectionActions') selectionActions!: TemplateRef<unknown>;
  @ContentChild('actions') actions!: TemplateRef<unknown>;

  @Input() dataSource!: MatTableDataSource<any>;
  @Input() displayedColumns: string[] = [];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 50];
}
