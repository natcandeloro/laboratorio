import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.css']
})
export class ModalEditComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  closeModal(){
    this.closeModalEvent.emit();
  }
}
