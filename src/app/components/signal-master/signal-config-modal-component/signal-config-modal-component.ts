import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CongestionLevel } from '../../../interfaces/congestion-levels.interface';
import { Signal } from '../../../interfaces/signal-config.interface';
import { CongestionLevelsService } from '../../../services/congestion-levels.service';
import { Status } from '../../../enums/status';
import { SignalConfigService } from '../../../services/signal-config.service';

@Component({
  selector: 'app-signal-config-modal-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signal-config-modal-component.html',
  styleUrl: './signal-config-modal-component.scss'
})
export class SignalConfigModalComponent implements OnInit {
  @Input() signalData: Signal | undefined;
  @Input() id: number = 0;
  congestionLevels: CongestionLevel[] = [];
  logicOptions: string[] = [];
  fields: string[] = [];
  operators: string[] = [];
  signals: Signal[] = [];
  title?: string = 'Signal Configuration';
  ruleForm!: FormGroup;
  errorInLogic: boolean = false;
  statusOptions = Status;
  statusKeys = Object.keys(Status) as (keyof typeof Status)[];

  constructor(
    public bsModalRef: BsModalRef,
    private readonly fb: FormBuilder,
    private readonly signalService: SignalConfigService
  ) {}

  ngOnInit(): void {
    this.ruleForm = this.fb.group({
      status: ['', Validators.required],
      rtoCode: ['', Validators.required],
      rtoLocation: ['', Validators.required],
      signalId: ['', Validators.required],
      signalLocation: ['', Validators.required],
      comments: ['', Validators.nullValidator],
      description: ['', Validators.nullValidator]
    });

    if (this.signalData) {
      this.loadSignalData(this.signalData);
    }
  }

  loadSignalData(data: Signal) {
    this.ruleForm.patchValue({
      status: data.status,
      rtoCode: data.rtoCode,
      rtoLocation: data.rtoLocation,
      signalId: data.signalId,
      signalLocation: data.signalLocation,
      comments: data.comments,
      description: data.description
    });
  }

  submit() {
    if (this.id && this.id > 0) {
      this.signalService.updateSignalMetadata(this.id, this.ruleForm.value).pipe(take(1)).subscribe({
        next: (data) => {
          console.log('Signal updated successfully:', data);
          this.bsModalRef.hide();
        },
        error: (error) => {
          console.error('Error updating signal:', error);
        }
      });
    } else {
      this.signalService.addSignalMetadata(this.ruleForm.value).pipe(take(1)).subscribe({
        next: (data) => {
          console.log('Signal added successfully:', data);
          this.bsModalRef.hide();
        },
        error: (error) => {
          console.error('Error adding signal:', error);
        }
      });
    }
  }
}
