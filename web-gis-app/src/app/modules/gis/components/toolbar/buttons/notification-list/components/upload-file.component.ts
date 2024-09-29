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

@AutoUnsubscribe
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
})
export class UploadFileComponent {
  form!: UntypedFormGroup;
  fileName: any;

  activeOptions = ACTIVE_OPTIONS;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private documentService: DocumentService,
    private appResponseHandlerService: AppResponseHandlerService,
    private dialogRef: MatDialogRef<UploadFileComponent>,
    private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      file: [undefined, Validators.required],
    });
  }
  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.form.patchValue({
        file: file,
      });
      this.form?.get('file')?.updateValueAndValidity();
      this.fileName = file.name;
    }
  }
  removeFile() {
    this.form.get('file')?.reset();
  }
  save(): void {
    const { file } = this.form.getRawValue();

    const formData = new FormData();
    formData.append(file.name, file);

    this.documentService
      .uploadDocument(formData)
      .pipe(
        take(1),
        this.appResponseHandlerService.handleSuccessMessage(
          () => 'Document Uploaded successfully!'
        ),
        tap(() => {
          this.dialogRef.close(true);
        })
      )
      .subscribe();
  }
}
