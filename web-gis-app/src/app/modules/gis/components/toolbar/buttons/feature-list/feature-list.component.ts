import { Component } from '@angular/core';
@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
})
export class FeatureListComponent {
  featureDialogVisible: boolean = false;

  showDialog() {
    this.featureDialogVisible = true;
  }
}
