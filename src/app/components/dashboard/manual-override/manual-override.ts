import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverrideRequest, SignalStatus } from '../../../interfaces/signal-config.interface';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SignalConfigService } from '../../../services/signal-config.service';
import { take } from 'rxjs';
import { OverrideAction } from '../../../enums/override-action';

@Component({
  selector: 'app-manual-override',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manual-override.html',
  styleUrl: './manual-override.scss'
})
export class ManualOverride implements OnInit {
  @Input() signalData: SignalStatus | undefined;
  @Input() id: number = 0;
  logicOptions: string[] = [];
  fields: string[] = [];
  operators: string[] = [];
  title?: string = 'Manual Override';
  ruleForm!: FormGroup;
  errorInLogic: boolean = false;
  overrideActionOptions = OverrideAction;
  overrideActionKeys = Object.keys(OverrideAction) as (keyof typeof OverrideAction)[];

  constructor(
    public bsModalRef: BsModalRef,
    private readonly fb: FormBuilder,
    private readonly signalService: SignalConfigService
  ) {}

  ngOnInit(): void {
    this.ruleForm = this.fb.group({
      overrideAction: ['', Validators.required],
      durationSeconds: [0, Validators.required]
    });
  }

  submit() {
    const payload: OverrideRequest = {
      signalId: this.signalData?.signalId || '',
      overrideAction: this.ruleForm.value.overrideAction,
      durationSeconds: this.ruleForm.value.durationSeconds
    };
    this.signalService.updateOverride(payload).pipe(take(1)).subscribe({
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
