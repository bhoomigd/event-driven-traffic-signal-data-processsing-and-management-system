import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog-component',
  imports: [CommonModule],
  templateUrl: './confirm-dialog-component.html',
  styleUrl: './confirm-dialog-component.scss'
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure you want to continue?';

  public onClose!: (result: boolean) => void;

  constructor(public bsModalRef: BsModalRef) {}

  onConfirm() {
    if (this.onClose) this.onClose(true);
    this.bsModalRef.hide();
  }

  onCancel() {
    if (this.onClose) this.onClose(false);
    this.bsModalRef.hide();
  }
}
