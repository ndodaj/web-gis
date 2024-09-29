import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-radius',
  templateUrl: './add-radius.component.html',
})
export class AddRadiusComponent {
  @Input() fields: any[] = [];
  @Output() formSubmit = new EventEmitter<any>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRadiusComponent>
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.form = this.fb.group({
      radius: ['', Validators.required],
    });
  }

  submitForm() {
    const { radius } = this.form.getRawValue();
    console.log(radius);
    const data = {
      radius: radius,
    };
    this.dialogRef.close(data);
    // this.drawCircleInMeter(map, radius, center);
    // this.saveBufferToLayer(this.polygonFromCircle);
  }
}
