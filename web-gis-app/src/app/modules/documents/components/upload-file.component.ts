import { Component, Inject } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AutoUnsubscribe } from '@core/utils';
import { ACTIVE_OPTIONS } from '@shared/constants/active-options';
import { take, tap } from 'rxjs';
import { AppResponseHandlerService } from '@core/services/app-response-handler.service';
import { DocumentService } from '@core/api/services/document.service';
import { DomSanitizer } from '@angular/platform-browser';

@AutoUnsubscribe
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
})
export class UploadFileComponent {
  form!: UntypedFormGroup;
  fileName: any;
  preview: any = undefined;

  activeOptions = ACTIVE_OPTIONS;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private documentService: DocumentService,
    private appResponseHandlerService: AppResponseHandlerService,
    public sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<UploadFileComponent>,
    private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      id: [
        {
          value: this.dialogData?.result?.id,
          disabled: true,
        },
      ],
      file: [this.dialogData?.result?.name, Validators.required],
    });
  }
  onFileChange(event: any) {
    this.dialogData = null;
    const file = event.target.files[0];

    if (file) {
      this.form.patchValue({
        file: file,
      });
      this.form?.get('file')?.updateValueAndValidity();
    }
  }
  removeFile() {
    this.form.get('file')?.reset(); // Reset the file form control
  }

  save(): void {
    const { id, file } = this.form.getRawValue();
    const formData = new FormData();

    if (id) {
      formData.append('id', id);
    }

    formData.append('file', file);

    this.documentService
      .upload(formData)
      .pipe(
        take(1),
        this.appResponseHandlerService.handleSuccessMessage(() =>
          id
            ? 'Document Updated successfully!'
            : 'Document Uploaded successfully!'
        ),
        tap(() => {
          this.dialogRef.close(true);
        })
      )
      .subscribe();
  }
}
