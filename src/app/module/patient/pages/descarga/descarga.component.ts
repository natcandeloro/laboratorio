import { Component, OnInit } from '@angular/core';
import { AngularFirestore, QueryFn} from '@angular/fire/compat/firestore';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

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
  showError: boolean = false;
  errorMessage: string = '';
  pacientes$!: Observable<any[]>;

  constructor(private firestore: AngularFirestore,
    private formBuilder: FormBuilder,) {
      // this.pacientes$ = this.firestore.collection('pacientes').valueChanges();
    }

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
  this.firestore.collection('pacientes').ref.where('dni', '==', this.formGroup.controls['dni'].value).get().then(querySnapshot => {
      if (querySnapshot.empty) {
          console.error('No se encontró ningún paciente con el DNI proporcionado');
          const mensajeErrorElement = document.createElement('div');
          mensajeErrorElement.innerText = 'No se encontró ningún paciente con el DNI proporcionado';
          mensajeErrorElement.style.color = 'red'; // Establece el color de texto en rojo para indicar un error
          document.getElementById('errorCard')?.appendChild(mensajeErrorElement); // Agrega el mensaje de error a la caja de error
          return;
      }
      const pacienteData = querySnapshot.docs[0].data() as Paciente;
      const paciente = pacienteData as Paciente;
      const fileURL = pacienteData.file;
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `documento_${this.dni}.pdf`;
      link.click();
  }).catch(error => {
      console.error('Error al buscar el paciente:', error);
      this.mostrarMensajeError('Ocurrió un error al buscar el paciente');
  });
}
  mostrarMensajeError(arg0: string) {
    throw new Error('Method not implemented.');
  }
 
      // BUSCADOR POR DNI
      search(): void {
        let queryFn: QueryFn<any> = ref => ref; 
        if (this.dni !== '') {
          queryFn = ref => ref.where('dni', '==', this.dni);
        } 
        this.pacientes$ = this.firestore.collection('pacientes', queryFn).valueChanges();

        this.pacientes$.subscribe(pacientes => {
          if (pacientes.length === 0) {
              this.errorMessage = "No se encontraron pacientes con el DNI especificado.";
          } else {
              this.errorMessage = ''; // Limpiar el mensaje de error si se encuentran pacientes
          }
      });
      }



}