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
  enviando = false;

  constructor (private fb: FormBuilder,
    private http: HttpClient){}

ngOnInit(){
  this.registroForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl ('', [Validators.required]),
  });
}

onSubmit(formData: any): void {
  if (this.registroForm.valid) {
    // Guardamos los datos antes de resetear
    const formData = this.registroForm.getRawValue();
    
    this.enviando = true;
    this.registroForm.reset();

    this.http.post('https://formsubmit.co/ajax/labparacelsus@gmail.com', formData)
      .subscribe(
        response => {
          console.log('Respuesta de FormSubmit:', response);
          this.mostrarMensajeEnviado = true;
          this.enviando = false;
          
          // Mostrar mensaje de éxito brevemente
          setTimeout(() => {
            this.mostrarMensajeEnviado = false;
          }, 3000);
        },
        error => {
          console.error('Error al enviar formulario:', error);
          this.enviando = false;
          // Opcional: Mostrar mensaje de error
          alert('Hubo un error al enviar el formulario. Por favor, intente nuevamente.');
        }
      );
  }
}
}
