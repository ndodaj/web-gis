import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Filter {
  field: string;
  condition: string;
  value?: string;
}

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
})
export class FilterDialogComponent {
  fields = [
    { name: 'OBJECTID_1', type: 'Number' },
    { name: 'emertimi_', type: 'String' },
    { name: 'inspireid', type: 'String' },
    // Add other fields as necessary
  ];
  filters: Filter[] = [];

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  addExpression() {
    this.filters.push({ field: '', condition: '' });
  }

  addSet() {
    // Implement add set functionality if needed
  }

  removeFilter(filter: Filter) {
    this.filters = this.filters.filter((f) => f !== filter);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onApply(): void {
    this.dialogRef.close(this.filters);
  }
}
