import { Component, Input, OnInit } from '@angular/core';
import { CongestionLevelsService } from '../../../services/congestion-levels.service';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { CongestionLevel } from '../../../interfaces/congestion-levels.interface';
import { CommonModule } from '@angular/common';
import { Signal } from '../../../interfaces/signal-config.interface';
import { SignalConfigService } from '../../../services/signal-config.service';

@Component({
  selector: 'app-congestion-rule-modal-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './congestion-rule-modal-component.html',
  styleUrl: './congestion-rule-modal-component.scss'
})
export class CongestionRuleModalComponent implements OnInit {
  @Input() ruleData: any = null;
  @Input() id: number = 0;
  congestionLevels: CongestionLevel[] = [];
  logicOptions: string[] = [];
  fields: string[] = [];
  operators: string[] = [];
  signals: Signal[] = [];
  title?: string = 'Congestion Levels';
  ruleForm!: FormGroup;
  errorInLogic: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private readonly fb: FormBuilder,
    private readonly congestionService: CongestionLevelsService,
    private readonly signalService: SignalConfigService
  ) {}

  ngOnInit(): void {
    this.signalsInfo();
    this.logicOptionsInfo();
    this.fieldsInfo();
    this.operatorsInfo();
    this.ruleForm = this.fb.group({
      description: ['', Validators.required],
      signalId: ['', Validators.required],
      conditions: this.fb.array([]),
      logic: ['NONE', Validators.required],
      enabled: [{ value: true, disabled: false }]
    }, { validators: this.logicValidator() });
    if (this.ruleData) {
      this.loadRuleData(this.ruleData);
    } else {
      this.addCondition();
    }
  }

  get conditions(): FormArray {
    return this.ruleForm.get('conditions') as FormArray;
  }

  get logicError(): boolean {
    return this.ruleForm.hasError('invalidLogic') && (this.ruleForm.get('logic')?.touched ?? false);
  }

  loadRuleData(rule: any) {
    this.ruleForm.patchValue({
      description: rule.description,
      signalId: rule.signalId,
      logic: rule.ruleExpression.logic,
      enabled: rule.enabled
    });

    // Prefill conditions
    rule.ruleExpression.conditions.forEach((cond: any) => this.addCondition(cond));
  }

  signalsInfo() {
    this.signalService.getSignals().pipe(take(1)).subscribe(data => {
      this.signals = data;
    });
  }

  logicOptionsInfo() {
    this.logicOptions = this.congestionService.getLogicOptions();
  }

  fieldsInfo() {
    this.fields = this.congestionService.getFields();
  }

  operatorsInfo() {
    this.operators = this.congestionService.getOperators();
  }

  addCondition(condition: any = null) {
    this.conditions.push(
      this.fb.group({
        field: [condition?.field || '', Validators.required],
        operator: [condition?.operator || '', Validators.required],
        value: [condition?.value || '', Validators.required],
      })
    );
  }

  removeCondition(index: number) {
    this.conditions.removeAt(index);
  }

  submit() {
    if (this.ruleForm?.invalid) {
      this.ruleForm.markAllAsTouched();
      return;
    }
    if (this.ruleForm?.valid) {
      const payload = this.ruleForm.getRawValue();

      const { conditions, logic, ...restOfProperties } = payload;

      const congestionLevelRequest: CongestionLevel = {
          ...restOfProperties,
          ruleExpression: {
              conditions,
              logic
          }
      };

      if (this.id) {
        this.congestionService.updateCongestionLevel(congestionLevelRequest, this.id).pipe(take(1)).subscribe(() => {
          console.log('Congestion level updated successfully');
        });
      } else {
        this.congestionService.setCongestionLevel(congestionLevelRequest).pipe(take(1)).subscribe(() => {
          console.log('Congestion level added successfully');
        });
      }

      this.bsModalRef?.hide();
    }
  }

  logicValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const conditions = control.get('conditions') as FormArray;
      const logic = control.get('logic')?.value;

      if (conditions && conditions.length > 1 && logic === 'NONE') {
        return { invalidLogic: true };
      }
      if (conditions && conditions.length <= 1 && logic !== 'NONE') {
        return { invalidLogic: true };
      }
      return null;
    };
  }
}
