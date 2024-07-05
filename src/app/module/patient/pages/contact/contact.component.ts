import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  mostrarMensajeEnviado: boolean = false; 
  registroForm!: FormGroup;

  constructor (private fb: FormBuilder,
    private http: HttpClient){}

ngOnInit(){
  this.registroForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl ('', [Validators.required]),
  });
}

onSubmit(formData: any): void {
  if (this.registroForm.valid) {
    const formData = this.registroForm.getRawValue();
  this.http.post('https://formsubmit.co/ajax/labparacelsus@gmail.com', formData).subscribe(response => {
    console.log('Respuesta de FormSubmit:', response);
    this.mostrarMensajeEnviado = true;
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }, (error) => {
    console.error('Error al enviar formulario:', error);
  });
};
    if (this.registroForm.valid) {
      console.log(this.registroForm.value);}
    }
    
}
