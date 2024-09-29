import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-properties-dialog',
  template: `
    <ul role="list" class="divide-y divide-gray-100">
      <li
        *ngFor="let prop of propertiesFiltered"
        class="flex justify-between gap-x-6 pt-1"
      >
        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">
            <span *ngIf="prop.key !== 'picture'">{{
              formatKey(prop.key)
            }}</span>
          </p>
          <p class="mt-2 text-sm leading-6 text-gray-900">
            <ng-container
              *ngIf="prop.key !== 'picture' && prop?.key !== 'date_time'"
            >
              <span>{{ prop.value }}</span>
            </ng-container>
            <ng-container *ngIf="prop.key === 'date_time'">
              <span>{{ formatDate(prop?.value) }}</span>
            </ng-container>
            <ng-container *ngIf="prop.key === 'picture'">
              <img
                [src]="prop.value"
                width="100"
                style="width: 100%;"
                class="shadow-4 cursor-pointer"
                (click)="openImageInNewTab(prop.value)"
              />
            </ng-container>
          </p>
        </div>
      </li>
    </ul>
  `,
  standalone: true,
  imports: [TableModule, CommonModule],
  providers: [DatePipe],
})
export class PropertiesDialogComponent {
  properties!: { key: string; value: any }[];
  propertiesFiltered: { key: string; value: any }[];

  constructor(
    public ref: DynamicDialogRef,
    private datePipe: DatePipe,
    @Inject(DynamicDialogConfig) public config: any
  ) {
    console.log(config);

    // Check if config.data is an object, then convert it into an array
    if (typeof config.data === 'object' && config.data !== null) {
      this.properties = Object.entries(config.data).map(([key, value]) => ({
        key,
        value,
      }));

      this.propertiesFiltered = this.properties.filter(
        (prop) =>
          prop.key !== 'id' &&
          prop?.key !== 'accepted' &&
          prop?.key !== 'gid' &&
          prop?.key !== 'Gid'
      );
    } else {
      this.propertiesFiltered = [];
    }
  }

  formatKey(key: string): string {
    if (key === 'img' || key === 'picture' || key === 'Picture') {
      return 'Picture:';
    } else {
      // Convert key with underscores to a different format
      return (
        key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ':'
      );
    }
  }
  formatDate(date: any): string {
    // Use DatePipe to format the date to your desired format
    // Parse the original date string using moment.js

    // Convert the adjusted date to the desired format
    const convertedDate = this.datePipe.transform(date, 'dd/MM/yyyy') as string;

    return convertedDate;
  }
  openImageInNewTab(imageUrl: string): void {
    window.open(imageUrl, '_blank');
  }
}
