import { Component, OnInit } from '@angular/core';
import { CongestionLevelsService } from '../../services/congestion-levels.service';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CommonModule } from '@angular/common';
import { CongestionLevel } from '../../interfaces/congestion-levels.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { CongestionRuleModalComponent } from './congestion-rule-modal-component/congestion-rule-modal-component';
import { ConfirmDialogComponent } from '../confirm-dialog-component/confirm-dialog-component';

@Component({
  selector: 'app-congestion-levels',
  standalone: true,
  imports: [CommonModule, AccordionModule],
  templateUrl: './congestion-levels.html',
  styleUrl: './congestion-levels.scss'
})
export class CongestionLevels implements OnInit {
  congestionLevels: CongestionLevel[] = [];
  modalRef?: BsModalRef;

  constructor(
    private readonly congestionService: CongestionLevelsService,
    private readonly modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getCongestionLevels();
  }

  getCongestionLevels() {
    this.congestionService.getCongestionLevels().pipe(take(1)).subscribe(data => {
      this.congestionLevels = data;
    });
  }

  openAddRuleModal() {
    this.modalRef = this.modalService.show(CongestionRuleModalComponent, {
      initialState: {
        title: 'Add Congestion Rule'
      }
    });
    this.onHiddenModal(this.modalRef);
  }

  openEditRule(rule: any) {
    this.modalRef = this.modalService.show(CongestionRuleModalComponent, {
      initialState: {
        ruleData: rule,
        id: rule.id
      }
    });
    this.onHiddenModal(this.modalRef);
  }

  onHiddenModal(modalRef: BsModalRef) {
    modalRef.onHidden?.subscribe(() => {
      // Refresh table or fetch new data after modal closes
      console.log('Modal closed');
      this.getCongestionLevels();
    });
  }

  confirmDelete(rule: any) {
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      initialState: {
        title: 'Delete Rule',
        message: `Are you sure you want to delete the rule "${rule.signalId} - ${rule.description}"?`
      }
    });

    const content = this.modalRef.content as ConfirmDialogComponent;
    content.onClose = (result: boolean) => {
      if (result) {
        this.deleteRule(rule);
      }
    };
  }

  deleteRule(rule: any) {
    console.log('Deleting rule:', rule);
    this.congestionService.deleteCongestionLevel(rule.id).pipe(take(1)).subscribe(() => {
      this.getCongestionLevels();
    });
  }
}
