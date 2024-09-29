import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-attribute-form',
  templateUrl: './edit-attribute-form.component.html',
})
export class EditAttributeFormComponent {
  @Input() fields: any[] = [];
  @Output() formSubmit = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.fields.forEach((field) => {
      this.form.addControl(
        field.name,
        this.fb.control('', Validators.required)
      );
    });
  }

  submitForm() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}
