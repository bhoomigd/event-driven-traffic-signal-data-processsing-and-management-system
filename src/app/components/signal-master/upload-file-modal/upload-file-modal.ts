import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, of, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CongestionLevel } from '../../../interfaces/congestion-levels.interface';
import { Signal } from '../../../interfaces/signal-config.interface';
import { CongestionLevelsService } from '../../../services/congestion-levels.service';
import { Status } from '../../../enums/status';
import { SignalConfigService } from '../../../services/signal-config.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload-file-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-file-modal.html',
  styleUrl: './upload-file-modal.scss'
})
export class UploadFileModal implements OnInit {
  @Input() signalData: Signal | undefined;
  @Input() id: number = 0;
  congestionLevels: CongestionLevel[] = [];
  logicOptions: string[] = [];
  fields: string[] = [];
  operators: string[] = [];
  signals: Signal[] = [];
  title?: string = 'Signal Configuration';
  uploadForm!: FormGroup;
  errorInLogic: boolean = false;
  statusOptions = Status;
  statusKeys = Object.keys(Status) as (keyof typeof Status)[];
  allowedMimeTypes = ['csv', 'xls', 'xlsx'];


  selectedFile: File | null = null;
  uploadMessage: string = '';

  constructor(
    public bsModalRef: BsModalRef,
    private readonly fb: FormBuilder,
    private readonly signalService: SignalConfigService
  ) { }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      file: [null, [Validators.required, this.fileTypeValidator(this.allowedMimeTypes)]],
    });
  }

  // Helper to get form controls easily in the template
  get f() {
    return this.uploadForm.controls;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFile = file;

      // Manually set the value for the 'file' FormControl to the actual File object
      this.uploadForm.get('file')?.setValue(file);

      // Clear any previous messages
      this.uploadMessage = `Selected: ${file.name}`;
    } else {
      this.selectedFile = null;
      this.uploadForm.get('file')?.setValue(null);
      this.uploadMessage = 'No file selected.';
    }
    // Update validation status after setting the value
    this.uploadForm.get('file')?.updateValueAndValidity();
  }

  fileTypeValidator(validTypes: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
      if (file) {
        const fileName = file.name as string;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();

        // Check for file extension (e.g., 'csv', 'xls', 'xlsx')
        if (fileExtension && validTypes.includes(fileExtension)) {
          return null; // File type is valid
        }

        // Check for common MIME types for XLS/XLSX just in case (though less reliable)
        const mimeType = file.type;
        if (mimeType === 'text/csv' || mimeType.includes('excel')) {
          return null; // File type is valid based on MIME type
        }

        return { invalidFileType: { value: file.name } }; // File type is invalid
      }
      return { required: true }; // File is missing (handled below, but good practice)
    };
  }

  submit() {
    // 1. Check if the form is valid (e.g., all fields and file type check out)
    if (this.uploadForm.invalid || !this.selectedFile) {
        this.uploadMessage = 'Please ensure all fields are valid and a correct file type (.csv, .xls, .xlsx) is selected.';
        this.uploadForm.markAllAsTouched(); // Show validation errors
        return;
    }

    // 2. Extract values from the form
    const username = 'bharathm913';
    const isPartialUpload = false;
    const fileToUpload = this.selectedFile;
    this.uploadMessage = 'Upload in progress...';

    // 3. Call the service
    this.signalService
      .uploadFile(fileToUpload, username)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log('file added successfully:', data);
          this.bsModalRef.hide();
        },
        error: (error) => {
          console.error('Error adding file:', error);
        }
      });
  }
}
