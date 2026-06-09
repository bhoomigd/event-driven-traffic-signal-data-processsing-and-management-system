import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SignalConfigModalComponent } from './signal-config-modal-component/signal-config-modal-component';
import { SignalConfigService } from '../../services/signal-config.service';
import { Signal } from '../../interfaces/signal-config.interface';
import { take } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog-component/confirm-dialog-component';
import { UploadFileModal } from './upload-file-modal/upload-file-modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Status } from '../../enums/status';
import { S } from '@storybook/angular/dist/types-3b0b7107.js';

@Component({
  selector: 'app-signal-master',
  standalone: true,
  imports: [CommonModule, AccordionModule, ReactiveFormsModule],
  templateUrl: './signal-master.html',
  styleUrl: './signal-master.scss'
})
export class SignalMaster implements OnInit {
  modalRef?: BsModalRef;
  signals: Signal[] = [];
  advancedSearchForm!: FormGroup;
  statusOptions = Status;
  statusKeys = Object.keys(Status) as (keyof typeof Status)[];

  constructor(
    private readonly modalService: BsModalService,
    private readonly fb: FormBuilder,
    private readonly signalService: SignalConfigService
  ) { }

  ngOnInit(): void {
    this.advancedSearchForm = this.fb.group({
      status: ['', Validators.nullValidator],
      createdBy: ['', Validators.nullValidator],
      createdTime: ['', Validators.nullValidator],
      modifiedBy: ['', Validators.nullValidator],
      modifiedTime: ['', Validators.nullValidator],
      signalMetadataId: ['', Validators.nullValidator],
      rtoCode: ['', Validators.nullValidator],
      rtoLocation: ['', Validators.nullValidator],
      signalId: ['', Validators.nullValidator],
      signalLocation: ['', Validators.nullValidator],
      comments: ['', Validators.nullValidator],
      description: ['', Validators.nullValidator],
    });
    this.getSignals();
  }

  openAddSignalModal() {
    this.modalRef = this.modalService.show(SignalConfigModalComponent, {
      initialState: {
        title: 'Add Signal Configuration'
      }
    });
    this.onHiddenModal(this.modalRef);
  }

  bulkUploadSignals() {
    this.modalRef = this.modalService.show(UploadFileModal, {
      initialState: {
        title: 'Bulk Upload Signal Configurations'
      }
    });
    this.onHiddenModal(this.modalRef);
  }

  // downloadSignals(s: Signal) {
  //   this.signalService.downloadSignals(s).pipe(take(1)).subscribe((data) => {
  //       next: (data) => {
  //         console.log('file added successfully:', data);
  //       },
  //       error: (error) => {
  //         console.error('Error adding file:', error);
  //       }
  //   });
  // }

  getSignals(params?: any) {
    this.signalService.getSignals(params).pipe(take(1)).subscribe(data => {
      this.signals = data;
    });
  }

  onHiddenModal(modalRef: BsModalRef) {
    modalRef.onHidden?.subscribe(() => {
      // Refresh table or fetch new data after modal closes
      console.log('Modal closed');
      this.getSignals();
    });
  }

  openEditConfig(s: Signal) {
    this.modalRef = this.modalService.show(SignalConfigModalComponent, {
      initialState: {
        signalData: s,
        id: s.signalMetadataId
      }
    });
    this.onHiddenModal(this.modalRef);
  }

  confirmDelete(s: Signal) {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: 'Delete Signal Configuration',
        message: `Are you sure you want to delete the signal "${s.signalId} - ${s.signalLocation}"?`
      }
    });

    const content = this.modalRef.content as ConfirmDialogComponent;
    content.onClose = (result: boolean) => {
      if (result) {
        this.deleteRule(s);
      }
    };
  }

  deleteRule(s: Signal) {
    console.log('Deleting signal:', s);
    this.signalService.deleteSignal(s.signalMetadataId, s).pipe(take(1)).subscribe(() => {
      this.getSignals();
    });
  }

  applyFilters() {
    const filters = this.advancedSearchForm.value;
    const cleanedFilters = this.removeNullValues(filters);
    console.log('Applying filters:', cleanedFilters);
    this.getSignals(cleanedFilters);
  }

  removeNullValues<T extends Signal>(obj: T): Partial<T> {
    if (!obj || typeof obj !== 'object') {
        // Return original if it's null, undefined, or not an object
        return obj as Partial<T>;
    }

    // 1. Get all key/value pairs
    // 2. Filter out entries where the value is strictly null
    // 3. Rebuild the object using reduce
    return Object.entries(obj).reduce((acc, [key, value]) => {
        // Check only for strict null (value !== null)
        if (value !== null) {
            // Re-assign the property and value to the accumulator (new object)
            acc[key as keyof T] = value;
        }
        return acc;
    }, {} as Partial<T>);
}

  resetFilters() {
    this.advancedSearchForm.reset();
    this.getSignals();
  }

  reactivate(s: Signal) {
    console.log('Reactivating signal:', s);
    this.signalService.reactivateSignal(s.signalMetadataId, s).pipe(take(1)).subscribe(() => {
      this.getSignals();
    });
  }
}
