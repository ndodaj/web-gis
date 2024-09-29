import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

@Component({
  selector: 'app-password-button',
  template: `
    <button
      (click)="toggleVisibility()"
      mat-icon-button
      matTooltip="Click to change the display"
      type="button"
    >
      <mat-icon [svgIcon]="icon"></mat-icon>
    </button>
  `
})
export class PasswordButtonComponent {
  icon = 'mat:visibility_off';
  visible = false;
  @Output() clickEvent = new EventEmitter<boolean>();
  @HostBinding('class.mat-mdc-form-field-icon-suffix') matFormFieldClass = true;

  toggleVisibility() {
    this.visible = !this.visible;
    this.icon = this.visible ? 'mat:visibility' : 'mat:visibility_off';
    this.clickEvent.emit(this.visible);
  }
}
