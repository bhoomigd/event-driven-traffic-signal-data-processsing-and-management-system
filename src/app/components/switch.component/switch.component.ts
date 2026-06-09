import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  imports: [],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class SwitchComponent {
  @Input() isChecked: boolean = false;
  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleSwitch() {
    this.isChecked = !this.isChecked;
    this.change.emit(this.isChecked);
    console.log('Switch toggled:', this.isChecked);
  }
}
