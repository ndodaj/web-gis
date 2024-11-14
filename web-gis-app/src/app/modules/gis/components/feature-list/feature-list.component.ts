import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CustomerService } from '@shared/services/customers.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from './filter-dialog.component';
import { MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { stagger60ms } from '@shared/animations/stagger.animation';

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-features-list',
  templateUrl: './feature-list.component.html',
  animations: [stagger60ms],
})
export class FeaturesListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: ColumnConfig[] = [];
  columnFilters: { [key: string]: string } = {};
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @Input() dialogVisible!: boolean;
  @Output() dialogVisibleChange = new EventEmitter<boolean>();

  get visibleColumns() {
    return this.displayedColumns.filter((c) => c.visible).map((c) => c.key);
  }

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
    this.dataSource.sort = this.sort;
    this.createFilterPredicate();
  }

  loadData() {
    const data = this.customerService.getData();
    if (data.length > 0) {
      this.displayedColumns = Object.keys(data[0]).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize for display
        visible: true,
      }));
    }
    this.dataSource.data = data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyColumnFilter(columnKey: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement?.value || '';
    this.columnFilters[columnKey] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.columnFilters); // Triggers filter update
  }
  createFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const columnFilters = JSON.parse(filter);
      return Object.keys(columnFilters).every((columnKey) => {
        const columnFilterValue = columnFilters[columnKey];
        return data[columnKey]
          ?.toString()
          .toLowerCase()
          .includes(columnFilterValue);
      });
    };
  }

  closeDialog() {
    this.dialogVisible = false;
    this.dialogVisibleChange.emit(this.dialogVisible); // Notifies the parent
  }

  openFilterDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Filters applied:', result);
        // Process the filters as needed
      }
    });
  }
  getFilterMenu(column: string): MatMenuPanel<any> | null {
    const index = this.visibleColumns.indexOf(column);
    const trigger = this.menuTriggers.toArray()[index];
    return trigger ? trigger.menu : null;
  }

  reset(data: any): void {
    console.log(data);
  }
}
