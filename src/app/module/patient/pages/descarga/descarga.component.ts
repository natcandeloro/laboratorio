import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


interface Paciente {
  id: number;
  nombre: string;
  dni: string;
  file: string;
  date: string;

  required: boolean;
}

@Component({
  selector: 'app-descarga',
  templateUrl: './descarga.component.html',
  styleUrl: './descarga.component.css'
})

export class DescargaComponent implements OnInit {

  fileURL!: string;
dniControl: any;
formGroup!: FormGroup;
dni = '';



  constructor(private firestore: AngularFirestore,
    private formBuilder: FormBuilder,) {}

  ngOnInit() {
        this.formGroup = new FormGroup({
  dni: new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(8),
    Validators.pattern('[0-9]*'),
  ]),
});
}

  descargarArchivo() {

    const dniControl = this.formGroup.get('dni');
    const errors = dniControl?.errors || {}; // Si errors es null, asigna un objeto vacío

    console.log('DNI antes de la consulta:', this.formGroup.controls['dni'].value);
    if (!this.formGroup.valid) {
        console.error('Formulario no válido');
        return;
    }
   // const dni = this.formGroup.controls['dni'].value.trim();

    this.firestore.collection('pacientes').ref.where('dni', '==', this.formGroup.controls['dni'].value).get().then(querySnapshot => {

     if (querySnapshot.empty) {
       console.error('No se encontró ningún paciente con el DNI proporcionado');
       console.log(this.formGroup.controls['dni'].value);
    console.log('DNI después de la consulta:', this.formGroup.controls['dni'].value);
       return;
       
     }
     const pacienteData = querySnapshot.docs[0].data() as Paciente;

     const paciente = pacienteData as Paciente;
     const fileURL = pacienteData.file;

      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `documento_${this.dni}.pdf`;
      link.click();
    });
    console.log(this.formGroup.controls['dni'].value);
    console.log('DNI después de la consulta:', this.formGroup.controls['dni'].value);
  }
  
}