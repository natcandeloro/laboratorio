import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],

})
export class ModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal() {
    this.closeModalEvent.emit();
  }
}
