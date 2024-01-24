import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],

})
export class ContactComponent {
  registroForm: FormGroup;
  constructor (private fb: FormBuilder){
     this.registroForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required],
  })
}


onSubmit() {

    if (this.registroForm.valid) {
      console.log(this.registroForm.value);}}

}
