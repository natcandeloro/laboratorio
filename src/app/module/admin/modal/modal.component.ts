import { Component, EventEmitter, Output } from '@angular/core';
//import { AngularFirestore } from '@angular/fire/firestore';




@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],

})
export class ModalComponent {
  
 // constructor(private firestore: AngularFirestore) { }


  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal() {
    this.closeModalEvent.emit();
  }
}
